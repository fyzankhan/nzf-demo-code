<template>
  <div class="flex justify-between radio-component">
    <div class="bg-white radio-container cursor-pointer" selected>
      <label class="mb-0 radio-label">
        <p class="text-xs margin-set bold-dark">{{ name }}</p>
        <div
          class="absolute checkmark-icon"
          v-if="this.giftAid === true && value == giftAidValue"
        >
          <i class="text-green ion-ios-checkmark-circle radio-check-icon"></i>
        </div>
        <div
          class="absolute checkmark-icon"
          v-if="this.giftAid === false && value == giftAidValue"
        >
          <i class="text-green ion-ios-checkmark-circle radio-check-icon"></i>
        </div>
      </label>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "CustomRadioInput",
  props: [
    "name",
    "giftAid",
    "giftAidClicked",
    "giftAidAmount",
    "value",
    "selected",
  ],
  computed: {
    ...mapState({
      giftAidValue: (state) => state.donation.giftAidValue,
    }),
  },
};
</script>

<style scoped lang="scss">
.checkmark-icon {
  left: 1px;
  top: -3px;
  font-size: 31px;
}

.radio-input {
  position: absolute;
  margin-right: -9999px;
}
.margin-set {
  margin-left: 10px;
}
</style>
