<template>
  <div
    class="font-semibold sm:text-lg"
    @click="emitClick"
    :class="{
      '-small': small,
      'label-fix': size == 'sm',
      btn: type !== 'text',
      'text-btn': type == 'text',
      'button-btn': type == 'button',
    }"
  >
    <span class="inner-btn-text">
      <slot></slot>
    </span>
  </div>
</template>

<script>
// class="text-blue-100 font-semibold"
export default {
  name: "Btn",
  props: ["small", "size", "type"],
  methods: {
    emitClick() {
      this.$emit("click");
    },
  },
};
</script>

<style scoped>
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .label-fix {
    width: 100% !important;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .label-fix {
    max-width: 330px !important;
    width: 115% !important;
    margin-right: 300px !important;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .label-fix {
    max-width: 330px !important;
    width: 115% !important;
    margin-right: 300px !important;
  }
}
</style>
