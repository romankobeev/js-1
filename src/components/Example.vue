<template lang="pug">
  section
    .container
      img(src="/assets/img/logo.png" :alt="message")
      p {{ message }}
      p Count: {{ count }}
      button(@click="setCount(count + 1);") + 1
      button(@click="setCount(count - 1);") - 1
</template>
<script>
import {store, mutations} from "../store";

export default {
  data: function () {
    return {
      message: store.message,
    }
  },
  computed: {
    count() {
      return store.count;
    }
  },
  methods: {
    setCount: mutations.setCount
  }
};
</script>
<style lang="scss"
    scoped>
.container {
  text-align: center;
}

img {
  max-width: 200px
}
</style>
