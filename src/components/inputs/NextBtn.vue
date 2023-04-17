<template>
  <div
    class="w-full flex next-btn-container"
    :class="{
      '-back-btn-show': skip,
      '-align-left': this.align == 'left',
    }"
  >
    <div
      v-if="skip && additionalBtn.text.length == 0"
      class="w-full sm:w-1/2 pr-4"
    >
      <btn @click="prevScrollItem"> Back </btn>
    </div>

    <div
      v-if="saveCalculation.text.length > 0"
      class="w-full sm:w-1/2 pr-2"
      :class="{ 'pb-4': additionalBtn.text.length == 0 }"
    >
      <btn
        @click="openModal"
        style="border: 1px solid #2c91dc !important"
        class="test"
      >
        <span
          :id="saveCalculation.gtagId"
          style="float: left; padding-top: 5px; padding-right: 5px"
          >{{ saveCalculation.text }}
        </span>
        <img
          style="height: 35px; width: 35px"
          src="/static/img/save-logo.png"
          alt="Save calculation"
        />
      </btn>
    </div>

    <transition name="fade">
      <div
        class="w-full sm:w-1/2"
        v-if="additionalBtn.conditional"
        :style="[additionalBtn.size == 'sm' ? { 'margin-right': '60px' } : {}]"
      >
        <btn
          v-if="additionalBtn.text.length > 0"
          @click="additionalPath"
          :id="additionalBtn.gtagId"
          :size="additionalBtn.size"
          :type="additionalBtn.type"
          class="mb-4 sm:mb-0"
          :class="{
            '-active':
              additionalBtn.conditional && additionalBtn.type !== 'button',
            'text-green': !additionalBtn.conditional,
            'pointer-events-none': !additionalBtn.conditional,
            'sm:mr-2': this.align !== 'left',
            'sm:ml-2': this.align === 'left',
          }"
        >
          <span :id="additionalBtn.gtagId">{{ additionalBtn.text }}</span>
        </btn>
      </div>
    </transition>

    <div
      class="w-full sm:w-1/2 continue-btn"
      :class="{ '-align-left': this.align == 'left' }"
    >
      <btn
        :id="gtagId"
        @click="nextScrollItem"
        class="next-btn text-green"
        :class="{
          '-active': active,
          'pointer-events-none': !active,
          'md:ml-2': additionalBtn.text.length == 0,
        }"
      >
        <span
          :id="gtagId + '-text'"
          :style="[additionalBtn.size == 'sm' ? { 'padding-left': '5px' } : {}]"
          >{{ text }}</span
        >
      </btn>
    </div>
  </div>
</template>

<script>
import Btn from "./Btn";
import { EventBus } from "../../utils/eventBus.js";
import { mapFields } from "vuex-map-fields";
import { mapState } from "vuex";
import Vue from "vue";

export default {
  components: { Btn },
  props: {
    text: {
      type: String,
      default: "Continue",
    },
    skip: {
      type: Boolean,
      default: true,
    },
    id: {
      default: "",
    },
    step: {
      default: "",
    },
    prevStep: {
      default: "",
    },
    path: {
      default: "",
    },
    active: {
      type: Boolean,
    },
    additionalBtn: {
      type: Object,
      default: () => {
        return {
          gtagId: "",
          path: "",
          text: "",
          size: "",
          type: "",
        };
      },
    },
    saveCalculation: {
      type: Object,
      default: () => {
        return {
          path: "",
          text: "",
          padding: {
            type: Boolean,
            default: true,
          },
        };
      },
    },
    gtagId: {
      type: String,
      default: "",
    },
    size: {
      type: String,
    },
    align: {
      type: String,
    },
    sectionId: {
      type: String,
    },
  },
  methods: {
    nextScrollItem() {
      if (this.sectionId === "display-zakat-section") {
        EventBus.$emit("sendEmail");
      }
      if (!this.step) {
        EventBus.$emit("setInputFocus");
      }
      if (this.path.length > 0) {
        if (this.id == "round-section" || this.id == "display-zakat-section") {
          if (this.calculatorProgress == 100) {
            this.$router.push({ path: this.path });
          } else {
            this.calculatorProgress = 100;
            setTimeout(() => {
              this.$router.push({ path: this.path });
            }, 500);
            return;
          }
        }

        this.$router.push({ path: this.path });
        return;
      }

      EventBus.$emit("nextBtnClicked", {
        id: this.id,
        step: this.step,
      });
      this.$emit("nextClick");
      this.$store.dispatch("SaveLocalStateData");
    },
    prevScrollItem() {
      EventBus.$emit("prevBtnClicked", {
        id: this.id,
        step: this.prevStep,
      });
      this.$store.dispatch("SaveLocalStateData");
    },
    openModal() {
      "donation.allocation",
        EventBus.$emit("openModal", {
          step: this.step,
        });
    },
    additionalPath() {
      if (this.additionalBtn.gtagId == "fast-forward-payment") {
        if (this.allocation == "custom") {
          this.$store.dispatch("setAllocation", "custom");
        } else {
          this.$store.dispatch("setRecommendedDonation", this.donationSplit);
        }
      }
      if (this.additionalBtn.next) {
        this.$emit("additionalClick");

        // Need to allow previous event to propagate
        // to other components before acting on the next one
        Vue.nextTick(() => {
          EventBus.$emit("nextBtnClicked", { id: this.id });
        });
      } else {
        this.$router.push({ path: this.additionalBtn.path });
      }
      this.$store.dispatch("SaveLocalStateData");
    },
  },
  computed: {
    ...mapState({
      donationSplit: (state) => state.donation.donationSplit,
      SupportCostSlider: (state) => state.settings.SupportCostSlider,
    }),
    ...mapFields(["calculatorProgress", "donation.allocation"]),
  },
};
</script>

<style scoped lang="scss">
.test:hover {
  background-color: #2c91dc !important;
  color: #ffffff;
}
</style>