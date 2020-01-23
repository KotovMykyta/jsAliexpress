document.addEventListener('DOMContentLoaded', () => {

const search = document.querySelector('.search');
const cartBtn = document.getElementById('cart');
const cart = document.querySelector('.cart');
const wishlistBtn = document.getElementById('wishlist');
const goodsWrapper = document.querySelector('.goods-wrapper');
const category = document.querySelector('.category');
const cardCounter = cartBtn.querySelector('.counter');//счётчики количества товаров в корзине
const wishlistCounter = wishlistBtn.querySelector('.counter');//счётчики количества товаров в избранных
//spinner
const loading =  () => {
    goodsWrapper.innerHTML = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
    </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`
};

const wishlist = [];


const createCardGoods = (id, title, price, img) => {
    const card = document.createElement('div');
    
    //присвоить элементу card класс
    card.className = "card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3";
    
    //вставить вёрстку в элемент card
    card.innerHTML = `<div class="card">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="${img}" alt="">
                            <button class="card-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"
                                data-goods-id="${id}"></button>
                        </div>
                        <div class="card-body justify-content-between">
                            <a href="#" class="card-title">${title}</a>
                            <div class="card-price"> ${price} ₽</div>
                            <div>
                                <button class="card-add-cart"
                                    data-goods-id="${id}">Добавить в корзину</button>
                            </div>
                        </div>
                    </div>`;

    return card;
    //console.log('card: ', card);
};
//console.log(createCardGoods());

//функция рендера товаров
const renderCard = items => {
    //console.log(item);
    
    //удалить 3 предыдущих элемента добавленные через appendChild
    goodsWrapper.textContent = '';
    
    if (items.length){
    //перебираем все элементы из полученного массива items, создаем карточки товаров
    items.forEach( item => {
        //console.log(item);
        const {id, title, price, imgMin} = item; //Деструктуризация
        goodsWrapper.appendChild(createCardGoods(id, title, price, imgMin));
    })} else{
        goodsWrapper.textContent = 'Ooooooops! It looks like items still coming 🤷‍♂️';
    }  
};

goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, "img/temp/Archer.jpg"));
goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 1488, "img/temp/Flamingo.jpg"));
goodsWrapper.appendChild(createCardGoods(3, 'Носки', 40, "img/temp/Socks.jpg"));

//функция обработчик нажатия корзины
const openCart = (event) => {
    //метод запрета перехода по ссылке, если она есть в a.href в html
    event.preventDefault();

    cart.style.display = 'flex';

    document.addEventListener('keyup', closeCart);

    /*
    //добавление закрытия окна Корзина по нажатию клавиши Esc
    document.addEventListener('keydown', (e) => {
    //вывод в консоль кодов нажатия клавиш клавиатуры
    console.log(e.keyCode);
    
    if(e.keyCode === 27){
        cart.style.display = '';
    }
    });*/
   
};

//функиця закрытия окна Корзина
const closeCart = (event) => {
    //console.log('event: ', event);
    
    //получение event.target клика в переменную
    const target = event.target;
    
    //закрытие по клику вне зоны cart через target
    if( target === cart || 
        target.className === 'cart-close' || //или target.classList.contains('cart-close');
        event.keyCode === 27){ //закрытие по Esc
            cart.style.display = '';
            document.removeEventListener('keyup', closeCart);
    }
    
    //вывод в консоль кодов нажатия клавиш клавиатуры
    //console.log(event.keyCode);
    
};

//функция которая получает товары
const getGoods = (handler, filter) => { //handler-просто аргумент, в нашем случае renderCard
    loading();//вызов функции вставки спиннера
    fetch('db/db.json')
    .then(response => response.json()) // возвращается промис, перевод data в массив, return дальше
    .then(filter) // функция фильтра товаров по категориям
    .then(handler);//каждый then что то return'ит
    
};

//метод перемешивания всех товаров через рандомную сортировку массива
const randomSort = (items) => {
    return items.sort(() => Math.random()-0.5);//сортировка массива через рандом, запись -0.5 делает как + так и -
}

const chooseCategory = event => {
    event.preventDefault();
    const target = event.target;

    if(target.classList.contains('category-item')){ //через таргет нажатия категорий
       // console.log(target.dataset.category);//получение всех дата атрибутов по нажатию на категорию
       const category = target.dataset.category;
       getGoods(renderCard, items => items.filter(item => item.category.includes(category)));
    }
};

const searchGoods = event => {
     event.preventDefault();//отмена перезагрузки страницы после нажатия Enter на строке поиска
     //console.log(event.target.elements);//колекция елементов формы поиска
     const input = event.target.elements.searchGoods;//получение input елемента коллекции формы
     //console.log(input.value);//получение введенной строки в поиск
     
     const inputValue = input.value.trim();
     if (inputValue !== ''){
         const searchString = new RegExp(inputValue, 'i');// 'i' не учитывает регистр
         getGoods(renderCard, goods => goods.filter(item => searchString.test(item.title)));
     } else {
         search.classList.add('error');//мигание рамки строки поиска при пустом запросе поиска 2сек анимация
         setTimeout( () => {
            search.classList.remove('error');
         }, 2000);
     }
     //очистка строки поиска по выполнению
     input.value = '';
};

//счётчик колличества товаров в избранном
const checkCount = () => {
    wishlistCounter.textContent = wishlist.length;
};

//wishlist в localStorage
const storageQuery = get => {
    if (get){
        if (localStorage.getItem('wishlist')){
            JSON.parse(localStorage.getItem('wishlist')).forEach(id => wishlist.push(id));   
        }
    } else {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));//добавление массива в localStorage
    }
    checkCount();
};

const toggleWishlist = (id, elem) => {
     if (wishlist.includes(id)){
        wishlist.splice(wishlist.indexOf(id), 1);//удаление из массива если этот элемент уже там есть
        elem.classList.remove('active');
     } else {
         wishlist.push(id);
         elem.classList.add('active');
     }
     checkCount();
     //console.log(wishlist);
     storageQuery();
     
     
};

const handlerGoods = event => {
    const target = event.target;
    //console.log('target: ', target);//получение таргета по клику
    if (target.classList.contains('card-add-wishlist')){
        toggleWishlist(target.dataset.goodsId, target);
    }
    
};

//отображение избранных товаров по клику на кнопку сердечко
const showWishlist = () => {
    getGoods(renderCard, goods => goods.filter(item => wishlist.includes(item.id)));
};

//повесить action на элемент иконки корзины
cartBtn.addEventListener('click', openCart);
//обработчик закрытия окна Корзина
cart.addEventListener('click', closeCart);
category.addEventListener('click', chooseCategory);
search.addEventListener('submit', searchGoods);
goodsWrapper.addEventListener('click', handlerGoods);
wishlistBtn.addEventListener('click', showWishlist);

getGoods(renderCard, randomSort);
storageQuery(true);

});