//корзина - пустой массив
const basket = []

let addToCart = document.querySelectorAll('.img-block__cart-title')

//ловим события по нажатию на кнопку добавить товар в корзину
addToCart.forEach(function (btn) {

    btn.addEventListener('click', function (event) {

        event.preventDefault()
        let productDetail = event.target.closest('.item-card')
        //добавляем в корзину текущий товар
        addToBasket(getProductData(productDetail))
        //установить в логотипе корзины ко-во товара
        setCountProduct(getQuantityProduct())
        //добавить разметку html для списка товаров
        addToHtml()
    })
})

//
let basketBtn = document.querySelector('.header-block__cart')
let basketInfo = document.querySelector('.basket-info')

//клик по иконке корзины для отображения списка товаров положенных в корзину
basketBtn.addEventListener('click', function (event) {
    basketInfo.classList.toggle('active')
})

//вывести на странице html с кол-вом товара в корзине
function setCountProduct(countProduct) {
    let count = document.querySelector('.header-block__cart-count')
    count.textContent = countProduct
}

//добавить товар в корзину с проверкой есть ли таков уже в корзине
function addToBasket(obj) {

    if (basket.length > 0) {

        let product = basket.find(item => item.title === obj.title);

        if (product) {
            //если товар уже есть в корзине
            let totalPrice = parseFloat(product.price.replace("$", ""))
            product.quantity = product.quantity + 1
            product.totalPrice = Number((totalPrice * product.quantity).toFixed(2))
        } else {
            addNewProduct(obj)
        }

    } else {
        addNewProduct(obj)
    }
}

//добавить в корзину новый товар, которого нет в корзине
function addNewProduct(obj) {
    basket.push(obj)
}

//Получить данные о товаре(стоимость, цена, кол-во) из html разметки
function getProductData(productDetail) {
    let title = productDetail.querySelector('h3').innerText
    let price = productDetail.querySelector('.card__price').innerText
    let quantity = 1
    let totalPrice = Number(parseFloat(price.replace("$", "")))
    return {title, price, quantity, totalPrice}

}

//Получить кол-во товаров в корзине
function getQuantityProduct() {
    return basket.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
}

//Получить общую сумму товаров
function getTotalAmount() {
    return basket.map(item => item.totalPrice).reduce((prev, curr) => prev + curr).toFixed(2)
}

//Добавить html разметку на страницу
function addToHtml() {
    let tr = ''
    let innerHtml = document.querySelector('.basket-info tbody')
    innerHtml.innerHTML = ''
    let table = document.querySelector('tbody')
    let totalAmount = document.querySelector('tfoot th')
    totalAmount.textContent = ''
    basket.forEach(product => {
        tr += `<tr>
<td>${product.title}</td>
<td>${product.quantity} шт</td>
<td>${product.price}</td>
<td>${product.totalPrice}$</td>
</tr>`
    })
    table.insertAdjacentHTML('afterbegin', tr)
    totalAmount.textContent = `Товаров в корзине на сумму: ${getTotalAmount()}$`


}






