const API = "https://fakestoreapi.com/products/";
const app = new Vue({
  el: "#app",
  data: {
    userSearch: "",
    showCart: false,
    cartItems: [],
    filtered: [],
    products: [],
    sum: 0,
    totalCartItems: 0,
    searchLine: "",
  },
  methods: {
    getJson(url) {
      return fetch(url)
        .then((result) => result.json())
        .catch((error) => console.log(error));
    },

    addToCart(product) {
      if (this.$data.cartItems.length === 0) {
        this.$data.cartItems.push(product);
      }

      if (this.$data.cartItems.find((element) => element.id === product.id)) {
      } else {
        this.$data.cartItems.push(product);
      }

      for (let i = 0; i < this.$data.cartItems.length; i++) {
        if (this.$data.cartItems[i].id === product.id) {
          this.$data.cartItems[i].quantity =
            this.$data.cartItems[i].quantity + 1;
        }
      }

      this.$data.sum = 0;
      for (let i = 0; i < this.$data.cartItems.length; i++) {
        this.$data.sum += Math.round(
          this.$data.cartItems[i].price * this.$data.cartItems[i].quantity
        );
      }
      this.totalCartItems = 0;
      this.$data.cartItems.forEach((element) => {
        this.totalCartItems += element.quantity;
      });
    },

    removeItem(product) {
      for (let i = 0; i < this.$data.cartItems.length; i++) {
        if (
          this.$data.cartItems[i].id === product.id &&
          this.$data.cartItems[i].quantity > 0
        ) {
          this.$data.cartItems[i].quantity =
            this.$data.cartItems[i].quantity - 1;
          this.$data.cartItems[i].id = product.id + 1;
          this.$data.cartItems[i].id = product.id - 1;
        }
        if (this.$data.cartItems[i].quantity === 0) {
          this.$data.cartItems.splice(i, 1);
        }
      }

      this.$data.sum = 0;
      for (let i = 0; i < this.$data.cartItems.length; i++) {
        this.$data.sum += Math.round(
          this.$data.cartItems[i].price * this.$data.cartItems[i].quantity
        );
      }
      this.totalCartItems = 0;
      this.$data.cartItems.forEach((element) => {
        this.totalCartItems += element.quantity;
      });
    },

    showCarts(event) {
      if (event.target.hasAttribute("src")) {
        this.$data.showCart = !this.$data.showCart;
      }
    },

    filterGoods() {
      this.$data.filtered = [];
      let regexp = new RegExp(this.$data.searchLine, "i");
      console.log(regexp);
      for (let item of this.$data.products) {
        if (regexp.test(item.title)) {
          this.$data.filtered.push(item);
        }
      }
    },
  },
  mounted() {
    this.getJson(API).then((data) => {
      for (let item of data) {
        this.products.push(item);
      }
      for (let i = 0; i < this.$data.products.length; i++) {
        this.$data.products[i].quantity = 0;
      }
      this.$data.filtered = this.$data.products;
    });
  },

  watch: {
    cartItems: function (product) {},
  },
});
