<template>
  <scroll-container>
    <full-page-slide class="-first" :btns="false">
      <div>
        <h1 class="header-2 header mb-6">
          {{ getLabel("Thank you for your donation") }}
        </h1>
        <p class="text-lg mb-2 bold-dark" v-if="receiptNo !== null">
          {{ getLabel("Receipt No Text") + " " + receiptNo }}
        </p>
        <p
          class="sub-text mb-8"
          v-if="
            getLabel(
              'See how your money can directly help Muslims in the UK'
            ) !== '*'
          "
        >
          {{
            getLabel("See how your money can directly help Muslims in the UK")
          }}
        </p>
        <!-- <div v-if="receiptNo !== null">
          <gm-share
            charity="national-zakat-foundation-uk"
            currency="gbp"
            :amount="amount"
            :firstName="first_name"
            :email="email"
            :operationId="receiptNo"
            :mode="giveMatchMode"
          >
          </gm-share>
        </div> -->
        <p
          class="sub-text mb-8"
          v-if="getLabel('Thank You Paragraph1') !== '*'"
        >
          {{ getLabel("Thank You Paragraph1") }}
        </p>
        <p
          class="sub-text mb-8"
          v-if="getLabel('Thank You Paragraph2') !== '*'"
        >
          {{ getLabel("Thank You Paragraph2") }}
        </p>
        <p class="sub-text mb-8">
          <span v-if="getLabel('Thank You Paragraph') !== '*'">{{
            getLabel("Thank You Paragraph")
          }}</span>

          <span
            class="block mt-4 flex flex-col lg:hidden"
            v-if="
              localRegularDonationsTotal > 0 || localSingleDonationsTotal > 0
            "
          >
            <span v-if="localSingleDonationsTotal > 0">
              <span class="bold-dark">Your one-off total is:</span> £{{
                localSingleDonationsTotal
              }}
            </span>

            <span v-if="localRegularDonationsTotal > 0">
              <span class="bold-dark">Your monthly total is:</span> £{{
                localRegularDonationsTotal
              }}
            </span>
          </span>
        </p>
        <hr class="border-gray-100 mb-8" />

        <p class="sub-text mb-2">
          {{ getLabel("Share Paragraph") }}
        </p>

        <p class="sub-text mb-2">
          {{ getLabel("Share to encourage others to donate their zakat") }}
        </p>

        <div class="mb-8">
          <social-icons></social-icons>
        </div>

        <hr class="border-gray-100 mb-10" />

        <div>
          <!--                    <video-player></video-player>-->
        </div>

        <div class="mb-8">
          <a
            href="https://www.surveymonkey.co.uk/r/NZFZakatGivingPortal"
            target="_blank"
            class="btn -active -feedback font-semibold sm:text-lg"
          >
            <div class="inner-btn-text">Give us feedback</div>
          </a>
        </div>
      </div>
    </full-page-slide>
  </scroll-container>
</template>

<script>
import ScrollContainer from "../scroll/ScrollContainer";
import FullPageSlide from "../FullPageSlide";
import SocialIcons from "../SocialIcons";
import { mapGetters, mapState } from "vuex";
import * as Cookies from "js-cookie";
import uniqid from "uniqid";
import { deliveryFeeText, paymentTypes } from "../../utils/GlobalVars";
import _ from "lodash";
import { roundToTwo } from "../../utils/helpers";
import axios from "axios";

export default {
  name: "ThankYouPage",
  components: { SocialIcons, ScrollContainer, FullPageSlide },
  data() {
    return {
      localDonationTypes: {},
      email: "",
      first_name: "",
      last_name: "",
      amount: "",
      receiptNo: null,
      giveMatchMode: process.env.VUE_APP_GIVEMATCH_MODE,
    };
  },
  computed: {
    ...mapGetters([
      "getLabel",
      "getSingleDonations",
      "getSingleDonationsTotal",
      "getRegularDonationsTotal",
      "getRegularDonations",
    ]),
    ...mapState({
      customerRef: (state) => state.customerRef,
    }),
    localRegularDonationsTotal() {
      if (_.isEmpty(this.localDonationTypes)) {
        return false;
      }

      let localRegularDonations = this.localDonationTypes.filter((el) => {
        return el.paymentType == paymentTypes.regular && el.amount > 0;
      });

      if (localRegularDonations.length > 0) {
        let t = localRegularDonations
          .map((el, index) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur));
        return roundToTwo(t).toFixed(2);
      }

      return 0.0;
    },
    localSingleDonationsTotal() {
      if (_.isEmpty(this.localDonationTypes)) {
        return false;
      }

      let localSingleDonations = this.localDonationTypes.filter((el) => {
        return el.paymentType == paymentTypes.single && el.amount > 0;
      });

      if (localSingleDonations.length > 0) {
        let t = localSingleDonations
          .map((el, index) => {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          })
          .reduce((acc, cur) => parseFloat(acc) + parseFloat(cur));
        return roundToTwo(t).toFixed(2);
      }

      return 0.0;
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    localStorage.removeItem("journyData");
    this.$store.dispatch("clearStore");
    Cookies.remove("vuex");

    if (
      window.location.href !== "http://localhost:8080/" ||
      window.location.href !== "http://192.168.1.115" ||
      window.location.href !== "http://nzf.pnpd.co.uk" ||
      window.location.href !== "http://nzforg.wixdek.com/" ||
      window.location.href !== "https://ghost.nzf.org.uk/"
    ) {
      this.$gtag.purchase({
        transaction_id: uniqid(`NZF_Donation_`),
        currency: "GBP",
        value: parseFloat(localStorage.getItem("total")),
        items: JSON.parse(localStorage.getItem("products")),
        transactionId: uniqid(`transactionId_`),
        transactionTotal: parseFloat(localStorage.getItem("total")),
      });
    }
    // {"data":{"customer":{"status":200,"ref":"5fe19692496739.495239771608619666"}}}
  },
  beforeMount() {
    if (localStorage.getItem("basket")) {
      this.localDonationTypes = JSON.parse(localStorage.getItem("basket"));
    }
    if (typeof this.customerRef.data !== "undefined") {
      if (typeof this.customerRef.data.customer !== "undefined") {
        let customerRef = this.customerRef.data.customer.ref;
        axios
          .post(process.env.VUE_APP_API_URL + "/receipt", {
            ref: customerRef,
          })
          .then((res) => {
            if (typeof res.data.receiptNo !== "undefined") {
              this.receiptNo = res.data.receiptNo;
              this.email = res.data.email;
              this.first_name = res.data.first_name;
              this.last_name = res.data.last_name;
              this.amount = res.data.amount;
            }
          })
          .catch((err) => {
            console.log(err.message);
          });
        // axios
        //   .post(process.env.VUE_APP_API_URL + "/shareCode", {
        //     ref: customerRef,
        //   })
        //   .then((res) => {
        //     console.log(res.data);
        //     this.shareCode = res.data;
        //   })
        //   .catch((err) => {
        //     console.log(err.message);
        //   });
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$store.dispatch("clearStore");
    next();
  },
};
</script>

<style scoped>
</style>
