<template>
  <div class="w-full">
    <!--<p class="text-sm text-gray-200 font-semibold mb-4">{{getLabel('Scroll up for previous question')}}</p>-->

    <h3 class="header header-1 mb-4">{{ getLabel("How you can help") }}</h3>
    <!-- Add sm:text-lg -->
    <p class="mb-4">
      {{ getLabel("You can choose where your Zakat is distributed") }}
    </p>

    <radio
      :buttons="buttons"
      name="allocation"
      class="mb-4"
      id="allocation"
      @change="radioSelect"
      @init="radioSelect"
      :wrap="false"
      :split="SupportCostSlider == '1' ? true : true"
    >
    </radio>

    <div class="mb-4 slider-container" v-if="donationSplit.length > 0">
      <donation-chart :dragging="dragging"></donation-chart>

      <div ref="slider-marker">
        <div
          v-for="(item, index) in donationSplit"
          :key="item.name"
          class="flex mb-6 justify-center items-center flex-col md:flex-row"
          :class="['slider-' + index]"
        >
          <div
            class="
              w-full
              md:w-3/12
              mb-4
              md:mb-0
              flex
              justify-between
              items-center
            "
          >
            <span class="flex w-full md:flex-col relative">
              <div class="bold-dark block flex items-start w-full sm:w-auto">
                <div class="flex items-start w-full">
                  <span class="flex-shrink pr-2 w-full font-heading-2">
                    {{ item.name }}
                  </span>

                  <div class="w-full sm:w-auto">
                    <tool-tip :text="getMessage(index)">
                      <div
                        class="
                          bg-gray-200
                          w-4
                          h-4
                          flex
                          justify-center
                          items-center
                          rounded-full
                          cursor-pointer
                          relative
                          z-50
                        "
                      >
                        <span
                          class="
                            icon-container
                            -blue
                            h-full
                            overflow-hidden
                            h-full
                          "
                        >
                          <i
                            class="
                              ion-ios-help
                              text-white
                              help-icon
                              h-full
                              flex
                              items-center
                            "
                          ></i>
                        </span>
                      </div>
                    </tool-tip>
                  </div>
                </div>
              </div>
            </span>

            <div
              class="flex flex-row-reverse items-center justify-end md:hidden"
            >
              <slider-amount-input
                :value="percentDisplay(item.split)"
                :item="item"
                @update="amountComponentUpdate"
              >
              </slider-amount-input>

              <div class="px-4 absolute slider-percent">
                {{ currencyFormat(item.amount) }}
              </div>
            </div>
          </div>

          <div class="w-full md:w-5/12 md:pl-4">
            <div class="px-2 sm:px-0">
              <vue-slider
                :ref="'slider' + index"
                tooltip="none"
                :interval="0.01"
                v-model="item.split"
                :min="0"
                :clickable="false"
                :contained="false"
                :dotOptions="{
                  max: splitCalc(item.split),
                }"
                :height="7"
                :processStyle="{
                  backgroundColor: item.color || sliderColor[index],
                }"
                :railStyle="{ backgroundColor: '#E1E1E1' }"
                :max="1"
                @change="updateDonation(item)"
                @dragging="isDragging"
                @drag-end="dragging = false"
              >
                <template v-slot:dot>
                  <div
                    class="
                      w-6
                      h-6
                      -ml-1
                      -mt-2
                      bg-white
                      cursor-pointer
                      border-gray-200 border-2
                      rounded-full
                    "
                  ></div>
                </template>
              </vue-slider>
            </div>
          </div>

          <div
            class="w-4/12 items-center ml-2 pl-4 hidden md:flex justify-between"
          >
            <div
              class="
                border border-gray-100
                rounded
                w-16
                text-center
                overflow-hidden
              "
              :class="{ 'pointer-events-none': allocation !== 'custom' }"
            >
              <input
                type="text"
                class="w-full h-full text-center py-2 slider-amount"
                :value="percentDisplay(item.split)"
                @keyup="inputUpdated(item, $event)"
                @focus="setOnFocus(item, $event)"
                @blur="setOnBlur(item, $event)"
              />
            </div>

            <div class="px-4">
              {{ currencyFormat(item.amount) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";
import { mapFields } from "vuex-map-fields";
import { mapState, mapGetters } from "vuex";
import DonationChart from "./DonationChart";
import { EventBus } from "../utils/eventBus";
import { roundToOne, currencyFormat, isXs } from "../utils/helpers";
import Radio from "./inputs/Radio";
import ToolTip from "./inputs/ToolTip";
import _ from "lodash";
import SliderAmountInput from "./inputs/SliderAmountInput";

export default {
  name: "DonationPage",
  components: { vueSlider, DonationChart, Radio, SliderAmountInput, ToolTip },
  data() {
    return {
      charities: [],
      totalSplit: 0,
      dragging: false,
      errorCount: 0,
      forceSupportCostMinimum: "",
      supportCostMinimum: "",
      sliderColor: ["#E15691", "#B80D57", "#644B96"],
    };
  },
  methods: {
    updateDonation(item) {
      let t = {
        target: {
          value: "" + item.split * 100,
        },
      };
      this.inputUpdated(item, t);
    },
    recommend() {
      this.$store.dispatch("setRecommendedDonation", this.donationSplit);
    },
    allocateEven() {
      this.$store.dispatch("setEvenDonation", this.donationSplit);
    },
    percentDisplay(percent) {
      if (isNaN(percent)) {
        percent = 0;
      }

      return roundToOne(percent * 100) + "%";
    },
    splitCalc(split) {
      let remainder = parseFloat(1 - this.getTotalSplit()).toFixed(3);
      if (remainder <= 0) {
        return split - Math.abs(remainder);
      }
      return this.getTotalSplit() >= 1 ? split : 1;
    },
    resetSplit() {
      this.$store.dispatch("resetSplit");
    },
    currencyFormat(amount) {
      return !amount ? "£0" : currencyFormat(amount);
    },
    radioSelect(val) {
      if (val == 1) {
        this.$store.commit("SET_ALLOCATION", "nzf");
        this.recommend();
      } else if (val == 2) {
        this.$store.commit("SET_ALLOCATION", "even");
        if (isXs()) {
          this.$scrollTo(this.$refs["slider-marker"], 500, { offset: -280 });
        }
        this.allocateEven();
      } else {
        if (this.allocation !== "custom") {
          if (isXs()) {
            this.$scrollTo(this.$refs["slider-marker"], 500, { offset: -280 });
          }

          this.$store.commit("SET_ALLOCATION", "custom");
          this.resetSplit();
        }
      }
    },
    getMessage(index) {
      return this.messages[index].message;
    },
    amountComponentUpdate(payload) {
      let formatVal = Math.round(payload.val.replace("%", ""));

      payload.item.split = formatVal / 100;

      if (isNaN(payload.item.split)) {
        return;
      }

      if (this.getTotalSplit() > 1) {
        this.errors.show = true;
        this.errors.message = this.getLabel(
          "You have allocated 100 of your donation total"
        );

        setTimeout(() => {
          this.errors.show = false;
          this.errors.message = "";
        }, 5000);

        payload.item.split = 0;
        return;
      }

      this.$store.dispatch("updateAmountByPercent");
    },
    setOnFocus(item, event) {
      event.target.value = "";
    },
    setOnBlur(item, event) {
      if (
        event.target.value == "" ||
        event.target.value == null ||
        event.target.value == "0%"
      ) {
        event.target.value = 0;
        this.$store.dispatch("updateAmountByPercent");
      }
    },
    inputUpdated: _.debounce(function (item, event) {
      let val = event.target.value;
      let formatVal = Math.round(val.replace("%", ""));

      item.split = formatVal / 100;

      if (isNaN(item.split)) {
        return;
      }

      if (this.getTotalSplit() > 1) {
        this.errors.show = true;
        this.errors.message = this.getLabel(
          "You have allocated 100 of your donation total"
        );

        setTimeout(() => {
          this.errors.show = false;
          this.errors.message = "";
        }, 5000);
        item.split = 0;
        return;
      }

      this.$store.dispatch("updateAmountByPercent");
    }, 500),
    isDragging: _.throttle(function (e) {
      if (this.allocation !== "custom") {
        this.$store.commit("SET_ALLOCATION", "custom");

        EventBus.$emit("setValue", {
          id: "allocation",
          val: "3",
        });
      }

      if (this.getTotalSplit() == 1) {
        this.errorCount++;
      } else {
        this.errorCount = 0;
      }

      if (this.errorCount > 2) {
        this.errors.show = true;
        this.errors.message = this.getLabel(
          "You have allocated 100 of your donation total"
        );

        setTimeout(() => {
          this.errors.show = false;
          this.errors.message = "";
        }, 5000);
      }

      this.dragging = true;
    }, 300),
  },
  computed: {
    buttons() {
      return [
        {
          name: "Let NZF decide",
          value: "1",
          selected: this.allocation == "nzf" ? true : false,
        },
        {
          name: "Spread equally",
          value: "2",
          selected: this.allocation == "even" ? true : false,
        },
        {
          name: "I'll decide",
          value: "3",
          selected: this.allocation == "custom" ? true : false,
        },
      ];
    },
    zakat() {
      return this.donationTypes[0].amount;
    },
    sliderDisable() {
      if (this.allocation != "nzf" && this.allocation != "even") {
        return false;
      }

      return true;
    },
    ...mapState({
      donation: (state) => state.donation,
      allocation: (state) => state.donation.allocation,
      SupportCostSlider: (state) => state.settings.SupportCostSlider,
      gateways: (state) => state.gateways,
    }),
    ...mapGetters(["getTotalSplit", "getLabel"]),
    ...mapFields([
      "donation.totalDonation",
      "donation.donationTypes",
      "donation.donationSplit",
      "donation.allocation",
      "errors",
    ]),
    messages() {
      return [
        {
          name: "Muslims in Poverty",
          message: this.getLabel("Muslims in Poverty Tool Tip"),
        },
        {
          name: "Leadership Schemes",
          message: this.getLabel("Leadership Schemes Tool Tip"),
        },
        {
          name: "Homeless Muslims",
          message: this.getLabel("Homeless Muslims Tool Tip"),
        },
      ];
    },
  },
  mounted() {
    // if (this.SupportCostSlider == "1") {
    //   const minimum = this.gateways.find(
    //     (gt) => gt.alias == "force-support-cost-minimum"
    //   );
    //   if (minimum) {
    //     if (minimum.active == "Yes") {
    //       this.forceSupportCostMinimum = parseInt(minimum.name) / 100;
    //     }
    //     this.supportCostMinimum = parseInt(minimum.name);
    //   }
    // } else {
    //   this.forceSupportCostMinimum = 0;
    // }
    // this.localSplit = this.donationSplit;
  },
};
</script>

<style scoped lang="scss">
</style>
