document.addEventListener('DOMContentLoaded', () => {

const search = document.querySelector('.search');
const cartBtn = document.getElementById('cart');
const cart = document.querySelector('.cart');
const wishlistBtn = document.getElementById('wishlist');
const goodsWrapper = document.querySelector('.goods-wrapper');
const category = document.querySelector('.category');
const cardCounter = cartBtn.querySelector('.counter');//счётчики количества товаров в корзине
const wishlistCounter = wishlistBtn.querySelector('.counter');//счётчики количества товаров в избранных
const cartWrapper = document.querySelector('.cart-wrapper');//корзина оболочка
//spinner
const loading = (nameFunction) => {
    const spinner = `<div id="spinner"><div class="spinner-loading"><div><div><div></div>
    </div><div><div></div></div><div><div></div></div><div><div></div></div></div></div></div>`;
    //console.log(nameFunction);
    if(nameFunction === 'renderCard'){
        goodsWrapper.innerHTML = spinner;
    }
    if(nameFunction === 'renderBasket'){
        cartWrapper.innerHTML = spinner; 
    }
};
 
const wishlist = [];
let goodsBasket = {};


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

//рендер товаров в корзине
const createCardGoodsBasket = (id, title, price, img) => {
    const card = document.createElement('div');
    card.className = "goods";
    card.innerHTML = `
    <div class="goods-img-wrapper">
        <img class="goods-img" src="${img}" alt="">
    </div>
    <div class="goods-description">
        <h2 class="goods-title">${title }</h2>
        <p class="goods-price">${price} ₽</p>
    </div>
    <div class="goods-price-count">
        <div class="goods-trigger">
            <button class="goods-add-wishlist ${wishlist.includes(id) ? 'active' : ''}"  
                data-goods-id="${id}"></button>
            <button class="goods-delete" data-goods-id="${id}" ></button>
        </div>
        <div class="goods-count">${goodsBasket[id]}</div>
    </div>`;

    return card;
};

const renderBasket  = items => {
    cartWrapper.textContent = '';  
    if (items.length){
    items.forEach( item => {
        const {id, title, price, imgMin} = item;
        cartWrapper.appendChild(createCardGoodsBasket(id, title, price, imgMin));
    })} else{
        cartWrapper.innerHTML = '<div id="cart-empty">Ooooooops! It looks like you didn\'t makes any orders 🤷‍♂️</div>';
    }  
};
 

goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, "img/temp/Archer.jpg"));
goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 1488, "img/temp/Flamingo.jpg"));
goodsWrapper.appendChild(createCardGoods(3, 'Носки', 40, "img/temp/Socks.jpg"));

const carcTotalPrice = goods => {
    let sum = 0;
    for (const item of goods){
        sum += item.price * goodsBasket[item.id];//console.log(item);
    }
    cart.querySelector('.cart-total>span').textContent = sum.toFixed(2);
};

const showCardBasket = goods => {
    const basketGoods = goods.filter(item => goodsBasket.hasOwnProperty(item.id));
    carcTotalPrice(basketGoods);
    return basketGoods;
}

//функция обработчик нажатия корзины
const openCart = (event) => {
    //метод запрета перехода по ссылке, если она есть в a.href в html
    event.preventDefault();
    cart.style.display = 'flex';
    document.addEventListener('keyup', closeCart);
    getGoods(renderBasket, showCardBasket);

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
    loading(handler.name);//вызов функции вставки спиннера
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

// возвращает куки с указанным name,
// или undefined, если ничего не найдено
// https://learn.javascript.ru/cookie#prilozhenie-funktsii-dlya-raboty-s-kuki
const getCookie = name => {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    )); 
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

const cookieQuery = get => {
    if (get){
        if (getCookie('goodsBasket')){
            Object.assign(goodsBasket, JSON.parse(getCookie('goodsBasket')));
            //goodsBasket = JSON.parse(getCookie('goodsBasket'));
        }
        checkCount(); 
    } else{
        document.cookie = `goodsBasket=${JSON.stringify(goodsBasket)}; max-age=86400e3`;
    }
    //console.log(goodsBasket);
};

//счётчик колличества товаров в избранном
const checkCount = () => {
    wishlistCounter.textContent = wishlist.length;
    cardCounter.textContent = Object.keys(goodsBasket).length;
};

//wishlist в localStorage
const storageQuery = get => {
    if (get){
        if (localStorage.getItem('wishlist')){
            wishlist.push(...JSON.parse(localStorage.getItem('wishlist')));
            //wishlist.splice(Infinity, 0, ...JSON.parse(localStorage.getItem('wishlist')));
            //JSON.parse(localStorage.getItem('wishlist')).forEach(id => wishlist.push(id));
            checkCount();
            //console.log(wishlist);
        }
    } else {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));//добавление массива в localStorage
    }
    
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

const addBasket = id => {
     if(goodsBasket[id]){
        goodsBasket[id] += 1;
     } else{
        goodsBasket[id] = 1;
     }
     //console.log(goodsBasket);
     checkCount();
     cookieQuery();
};

const handlerGoods = event => {
    const target = event.target;
    //console.log('target: ', target);//получение таргета по клику
    if (target.classList.contains('card-add-wishlist')){
        toggleWishlist(target.dataset.goodsId, target);
    };
    if (target.classList.contains('card-add-cart')){
        addBasket(target.dataset.goodsId);
    };
    
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
cookieQuery(true);

});