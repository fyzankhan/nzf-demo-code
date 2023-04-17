<template>
  <div class="display-zakat">
    <h1 class="header header-2 text-3xl mb-4">
      {{ getLabel("Your zakat calculation") }}
    </h1>
    <!-- Change sub-text to sm:text-lg -->
    <p class="sub-text mb-6 sm:mb-12">
      {{ getLabel("Zakat Display Paragraph") }}
    </p>

    <div class="flex sm:flex-row sm:-mx-4">
      <div class="w-1/2 sm:mx-4 mb-4">
        <hr />

        <div class="sub-text">{{ getLabel("Your zakatable assets") }}</div>

        <div
          class="text-1-5xl sm:text-2-5xl text-blue-200 font-semibold truncate"
        >
          {{ zakatableAssets() }}
        </div>
      </div>

      <div class="w-1/2 sm:mx-4 mb-4">
        <hr />

        <div class="sub-text">{{ getLabel("Your liabilities") }}</div>

        <div
          class="text-1-5xl sm:text-2-5xl text-red-200 font-semibold truncate"
        >
          {{ totalLiabilities() }}
        </div>
      </div>
    </div>

    <div class="flex sm:flex-row sm:-mx-4 mb-6">
      <div class="w-1/2 sm:mx-4 mb-4">
        <hr />

        <div class="sub-text">{{ getLabel("Net assets") }}</div>

        <div class="text-1-5xl sm:text-2-5xl text-green font-semibold truncate">
          {{ netAssets() }}
        </div>
      </div>

      <div class="w-1/2 sm:mx-4">
        <hr />

        <div class="sub-text">{{ getLabel("Nisab Value") }}</div>

        <div class="text-1-5xl sm:text-2-5xl text-black flex items-center">
          <div class="font-semibold mr-4">{{ nisabValue }}</div>

          <div>
            <right-pop-up :offset="16">
              <template v-slot:label>
                <div
                  class="
                    bg-gray-200
                    w-4
                    h-4
                    flex
                    justify-center
                    items-center
                    rounded-full
                    -mt-2
                    cursor-pointer
                    relative
                    z-50
                  "
                >
                  <span class="icon-container h-full overflow-hidden">
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
              </template>

              {{ getLabel("Nisab Tool Tip") }}
            </right-pop-up>
          </div>
        </div>
      </div>
    </div>

    <div
      class="
        items-center
        flex flex-col flex-wrap
        text-2xl
        p-4
        sm:pt-8 sm:pb-5 sm:px-8
        rounded
        border border-green
        bg-green-100
        text-green
        mb-10
        md:-mt-4
      "
    >
      <div class="w-full text-sm text-gray text-base font-semibold">
        {{ getLabel("Your Payable Zakat") }}
      </div>
      <div
        class="
          w-full
          text-4xl
          font-style-2 font-semibold
          leading-none
          sm:leading-normal
          truncate
        "
      >
        £{{ formatZakat() }}
      </div>
    </div>

    <div class="lg:mb-8 md:mb-8">
      <div class="w-full">
        <text-input
          name=""
          id="emailaddress"
          placeholder="Enter your email address"
          :currency="false"
          v-model="email"
          :validators="{ email: v.email }"
          errormessage="Please provide valid email"
          @errors="setValidate"
          :small="true"
        >
        </text-input>
      </div>
      <div class="w-full">
        <p>{{ getLabel("Save Calculation Feature") }}</p>
        <!-- <p>By using this calculation save feature, I agree to receive follow-up communication by email about the services provided by National Zakat Foundation. I understand that I will be able to unsubscribe from these emails at any time.</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import RightPopUp from "./inputs/RightMobilePopUp";
import { deliveryFeeText } from "../utils/GlobalVars";
import { mapGetters } from "vuex";
import { mapFields } from "vuex-map-fields";
import { mapState } from "vuex";
import TextInput from "./inputs/TextInput";
import validators from "../utils/validators";
import { EventBus } from "../utils/eventBus.js";

import {
  zakatableAssets,
  totalLiabilities,
  numberWithCommas,
  roundToTwo,
  zakatCalc,
} from "./../utils/helpers";

export default {
  name: "DisplayZakat",
  components: { RightPopUp, TextInput },
  data() {
    return {
      show: false,
      keepUpToDate: false,
      email: "",
      errorsArr: [],
    };
  },
  methods: {
    async emitCheckValidation() {
      await EventBus.$emit("checkValidation");
    },
    sendEmail() {
      let arr = this.errorsArr;
      this.emitCheckValidation();
      setTimeout(() => {
        if (this.email) {
          let resdata = JSON.parse(JSON.stringify(arr));
          let checkError = resdata.filter(
            (val) => typeof val.error !== "undefined"
          );
          if (checkError.length <= 0) {
            const summary = {
              WhatIHave: this.zakatableAssets(),
              WhatIOwe: this.totalLiabilities(),
              IsEqualTo: this.netAssets(),
              TodaysNisabIs: this.nisabValue,
              TotalZakat: this.formatZakat(),
            };
            const data = {
              calculatorJourny: JSON.stringify({
                assets: this.assets,
                filter: this.filter,
                settings: this.settings,
                goldSilver: this.goldSilver,
                pension: this.pension,
                zakatCalculation: this.zakatCalculation,
                summary: summary,
              }),
              firstName: "",
              lastName: "",
              emailAddress: this.email,
              keepUpToDate: true,
              tag: "ContinueCalculation",
              _uetsid: localStorage.getItem("_uetsid"),
              _uetsid_exp: localStorage.getItem("_uetsid_exp"),
              _uetvid: localStorage.getItem("_uetvid"),
              _uetvid_exp: localStorage.getItem("_uetvid_exp"),
            };

            this.$store
              .dispatch("sendCalculationJourny", data)
              .then((res) => {
                this.errorMsg = "";
                this.validates = false;
                this.errorsArr = [];
              })
              .catch((err) => {
                this.errorMsg = "Something went wrong please try again later!";
              });
          }
        }
      }, 5);
    },
    addDonation(val) {
      if (val == 1) {
        this.$store.dispatch("addDonation", {
          name: deliveryFeeText,
          amount: this.getZakatDeliveryCost(),
          id: 3,
          paymentType: "Single Donation",
        });
      } else {
        this.$store.dispatch("deleteDonation", 3);
      }
    },
    netAssets() {
      return (
        "£" +
        numberWithCommas(roundToTwo(zakatableAssets() - totalLiabilities()))
      );
    },
    zakatableAssets() {
      return "£" + numberWithCommas(zakatableAssets()).toLocaleString();
    },
    totalLiabilities() {
      return "£" + numberWithCommas(totalLiabilities());
    },
    formatZakat() {
      this.donationTypes[0].amount = parseFloat(this.getZakatCalc()).toFixed(2);
      return numberWithCommas(zakatCalc());
    },
    setValidate(payload) {
      if (!this.errorsArr.some((error) => error.id === payload.id)) {
        this.addError(payload);
      } else {
        this.updateError(payload);
      }

      this.errorsArr.some((error) => error.error)
        ? (this.validates = false)
        : (this.validates = true);
    },
    addError(error) {
      this.errorsArr.push(error);
    },
    updateError(updatedError) {
      this.errorsArr.forEach((error, index) => {
        if (error.id === updatedError.id) {
          this.errorsArr[index] = updatedError;
        }
        return error;
      });
    },
  },
  computed: {
    ...mapGetters([
      "getZakatDeliveryCost",
      "getZakat",
      "getOriginalZakat",
      "getZakatCalc",
      "getLabel",
      "getNissab",
    ]),
    ...mapState({
      zakatCalculation: (state) => state.zakatCalculation,
    }),
    ...mapFields({
      assets: "user.assets",
      filter: "calculatorFilter.selected",
      settings: "calculationSettings",
      goldSilver: "goldSilverWeightSettings",
      pension: "zakatCalculation.selectedPension",
      loading: "paymentSubmit.loading",
      donationTypes: "donation.donationTypes",
      zakat: "donation.zakat",
      nissab: "nissab",
    }),
    nisabValue() {
      return "£" + this.getNissab().toFixed(2);
    },
    v() {
      return { ...validators };
    },
    zakatNextButton() {
      if (this.showRound) {
        return { text: "Continue", skip: false, conditional: true };
      } else {
        return {
          text: "Continue",
          skip: false,
          path: "/donation",
          conditional: true,
        };
      }
    },
    showRound() {
      return this.getOriginalZakat() % 10;
    },
  },
  mounted() {
    window.scrollTo(0, 0);

    EventBus.$on("sendEmail", this.sendEmail);
    EventBus.$on("setInputFocus", () => {
      setTimeout(() => {
        if (document.getElementById("emailaddress")) {
          document.getElementById("emailaddress").focus();
        }
      }, 200);
    });
    this.donationTypes[0].amount = parseFloat(this.getZakatCalc()).toFixed(2);
    this.zakat = this.getZakatCalc();
  },
  beforeDestroy() {
    this.$store.commit("SET_RECOMMENDED_ZAKAT");
  },
  destroyed() {
    EventBus.$off("sendEmail");
  },
};
</script>

<style scoped>
</style>
