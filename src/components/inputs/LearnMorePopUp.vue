<template>
  <v-popover class="sm:relative w-full h-full" :offset="offsetStyle">
    <button
      class="
        focus:outline-none
        text-blue-100
        font-semibold
        block
        tooltip-target
      "
    >
      {{ label }}
      <slot name="label"></slot>
    </button>

    <template slot="popover">
      <slot></slot>
    </template>
  </v-popover>
</template>

<script>
import { mapFields } from "vuex-map-fields";

export default {
  name: "LearnMorePopUp",
  props: {
    label: {
      type: String,
    },
    offset: {
      type: Number,
    },
  },
  methods: {
    togglePopUp() {
      if (this.messageOpen === this._uid) {
        this.messageOpen = 0;
      } else {
        this.messageOpen = this._uid;
      }
    },
    hide() {
      this.messageOpen = 0;
    },
  },
  computed: {
    openMessage() {
      return this.messageOpen === this._uid;
    },
    ...mapFields(["messages.messageOpen"]),
    offsetCalc() {
      return this.offset - this.offset * 2;
    },
    offsetStyle() {
      if (this.offset) {
        return this.offset + "px";
      } else {
        return "12px";
      }
    },
  },
};
</script>
