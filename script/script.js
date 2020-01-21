document.addEventListener('DOMContentLoaded', () => {

const search = document.querySelector('.search');
const cartBtn = document.getElementById('cart');
const cart = document.querySelector('.cart');
const wishlistBtn = document.getElementById('wishlist');

const goodsWrapper = document.querySelector('.goods-wrapper');

const createCardGoods = (id, title, price, img) => {
    const card = document.createElement('div');
    
    //присвоить элементу card класс
    card.className = "card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3";
    
    //вставить вёрстку в элемент card
    card.innerHTML = `<div class="card">
                        <div class="card-img-wrapper">
                            <img class="card-img-top" src="${img}" alt="">
                            <button class="card-add-wishlist"
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

goodsWrapper.appendChild(createCardGoods(1, 'Дартс', 2000, "img/temp/Archer.jpg"));
goodsWrapper.appendChild(createCardGoods(2, 'Фламинго', 1488, "img/temp/Flamingo.jpg"));
goodsWrapper.appendChild(createCardGoods(3, 'Носки', 40, "img/temp/Socks.jpg"));





//функция обработчик нажатия корзины
const openCart = () => {
   cart.style.display = 'flex';
};

//функиця закрытия окна Корзина
const closeCart = (event) => {
    //console.log('event: ', event);
    
    //получение event.target клика в переменную
    const target = event.target;
    
    //закрытие по клику вне зоны cart через target
    if(target === cart || target.className === 'cart-close'){ //или target.classList.contains('cart-close');
        cart.style.display = '';
    }
    
};

//повесить action на элемент иконки корзины
cartBtn.addEventListener('click', openCart);

//обработчик закрытия окна Корзина
cart.addEventListener('click', closeCart);



});