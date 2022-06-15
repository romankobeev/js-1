//корзина
const basket = []

//конструктор для товара

let addToCart = document.querySelectorAll('.img-block__cart-title')

addToCart.forEach(function (btn) {

    btn.addEventListener('click', function (event) {

        event.preventDefault()
        let productDetail = event.target.closest('.item-card')
        addToBasket(getProductData(productDetail))
        setCountProduct(getQuantityProduct())
    })
})

let basketBtn = document.querySelector('.header-block__cart')
basketBtn.addEventListener('click', function (event) {
    console.log("+")
})



function setCountProduct(countProduct) {
    let count = document.querySelector('.header-block__cart-count')
    count.textContent = countProduct
}

function addToBasket(obj) {

   if (basket.length > 0) {

       let product = basket.find(item => item.title === obj.title );

       if (product) {
           //если товар уже есть в корзине
           let totalPrice = parseFloat(product.price.replace("$", ""))
           product.quantity = product.quantity + 1
           product.totalPrice = totalPrice * product.quantity

       } else {
           addNewProduct(obj)
       }

   } else {
       addNewProduct(obj)
   }
}

function addNewProduct(obj) {
    basket.push(obj)
}

function getProductData(productDetail) {
    let title = productDetail.querySelector('h3').innerText
    let price = productDetail.querySelector('.card__price').innerText
    let quantity = 1
    let totalPrice = parseFloat(price.replace("$",""))
    return {title, price, quantity, totalPrice}
}

function getQuantityProduct() {
    return basket.map(item => item.quantity).reduce((prev, curr) => prev + curr, 0);
}







