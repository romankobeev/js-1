const API =
  "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses";
const app = new Vue({
  el: "#app",
  data: {
    userSearch: "",
    showCart: false,
    catalogUrl: "/catalogData.json",
    cartUrl: "getBasket.json",
    cartItems: [],
    filtered: [],
    imgCart: "https://via.placeholder.com/50x100",
    product: [],
    imgProduct: "https://via.placeholder.com/200x500",
  },
  methods: {
    getJson(url) {
      return fetch(url)
        .then((result) => result.json())
        .catch((error) => console.log(error));
    },

    addProduct(item) {
      this.getJson(`${API}/addBasket.json`).then((data) => {
        if (data.result === 1) {
          let find = this.cartItems.find(
            (el) => el.id_product === item.id_product
          );
          if (find) {
            find.quantity++;
          } else {
            const prod = Object.assign({ quantity: 1 }, item);
            this.cartItems.push(prod);
          }
        }
      });
    },

    remove(item) {
      this.getJson(`${API}/deleteFromBasket.json`).then((data) => {
        if (data.resulr === 1) {
          if (item.quantity > 1) {
            item.quantity--;
          } else {
            this.cartItems.splice(this.cartItems.indexOf(item), 1);
          }
        }
      });
    },

    filter() {
      let regexp = new RegExp(this.userSearch, "i");
      this.filtered = this.products.filter((el) =>
        regexp.test(el.product_name)
      );
    },
  },
  mounted() {
    this.getJson(`${API + this.cartUrl}`).then((data) => {
      for (let item of data.contents) {
        this.cartItems.push(item);
      }
    }),
      this.getJson(`${API + this.catalogUrl}`).then((data) => {
        for (let item of data) {
          this.$data.products.push(item);
          this.$data.filtered.push(item);
        }
      }),
      this.getJson("getProducts.json").then((data) => {
        for (let item of data) {
          this.products.push(item);
          this.filtered.push(item);
        }
      });
  },
});
//корзина - пустой массив
const basket = [];

let addToCart = document.querySelectorAll(".img-block__cart-title");

//ловим события по нажатию на кнопку добавить товар в корзину
addToCart.forEach(function (btn) {
  btn.addEventListener("click", function (event) {
    event.preventDefault();
    let productDetail = event.target.closest(".item-card");
    //добавляем в корзину текущий товар
    addToBasket(getProductData(productDetail));
    //установить в логотипе корзины ко-во товара
    setCountProduct(getQuantityProduct());
    //добавить разметку html для списка товаров
    addToHtml();
  });
});

//
let basketBtn = document.querySelector(".header-block__cart");
let basketInfo = document.querySelector(".basket-info");

//клик по иконке корзины для отображения списка товаров положенных в корзину
basketBtn.addEventListener("click", function (event) {
  basketInfo.classList.toggle("active");
});

//вывести на странице html с кол-вом товара в корзине
function setCountProduct(countProduct) {
  let count = document.querySelector(".header-block__cart-count");
  count.textContent = countProduct;
}

//добавить товар в корзину с проверкой есть ли таков уже в корзине
function addToBasket(obj) {
  if (basket.length > 0) {
    let product = basket.find((item) => item.title === obj.title);

    if (product) {
      //если товар уже есть в корзине
      let totalPrice = parseFloat(product.price.replace("$", ""));
      product.quantity = product.quantity + 1;
      product.totalPrice = Number((totalPrice * product.quantity).toFixed(2));
    } else {
      addNewProduct(obj);
    }
  } else {
    addNewProduct(obj);
  }
}

//добавить в корзину новый товар, которого нет в корзине
function addNewProduct(obj) {
  basket.push(obj);
}

//Получить данные о товаре(стоимость, цена, кол-во) из html разметки
function getProductData(productDetail) {
  let title = productDetail.querySelector("h3").innerText;
  let price = productDetail.querySelector(".card__price").innerText;
  let quantity = 1;
  let totalPrice = Number(parseFloat(price.replace("$", "")));
  return { title, price, quantity, totalPrice };
}

//Получить кол-во товаров в корзине
function getQuantityProduct() {
  return basket
    .map((item) => item.quantity)
    .reduce((prev, curr) => prev + curr, 0);
}

//Получить общую сумму товаров
function getTotalAmount() {
  return basket
    .map((item) => item.totalPrice)
    .reduce((prev, curr) => prev + curr)
    .toFixed(2);
}

//Добавить html разметку на страницу
function addToHtml() {
  let tr = "";
  let innerHtml = document.querySelector(".basket-info tbody");
  innerHtml.innerHTML = "";
  let table = document.querySelector("tbody");
  let totalAmount = document.querySelector("tfoot th");
  totalAmount.textContent = "";
  basket.forEach((product) => {
    tr += `<tr>
<td>${product.title}</td>
<td>${product.quantity} шт</td>
<td>${product.price}</td>
<td>${product.totalPrice}$</td>
</tr>`;
  });
  table.insertAdjacentHTML("afterbegin", tr);
  totalAmount.textContent = `Товаров в корзине на сумму: ${getTotalAmount()}$`;
}
