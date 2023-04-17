<template>
  <div
    id="app"
    class="w-full h-full"
    style="overflow: hidden"
    :class="{ 'nav-open': isNavOpen }"
    v-if="loadingText"
  >
    <ie-detect></ie-detect>

    <div>
      <nav-bar></nav-bar>
    </div>

    <div class="flex container justify-center m-auto left">
      <!--Left-->
      <div class="hidden md:block w-full sm:w-3/12 hidden md:block">
        <sticky>
          <transition name="fade">
            <router-view name="left"></router-view>
          </transition>
        </sticky>
      </div>

      <!--Center-->
      <div class="h-full w-full md:w-9/12 lg:w-6/12">
        <transition name="fade" mode="out-in">
          <router-view name="center" class="center layout"></router-view>
        </transition>

        <flash-container>
          <transition name="fade">
            <error-message v-if="globalErrors.length">
              <span>
                {{ globalErrors[0] }}
              </span>
            </error-message>
          </transition>
        </flash-container>
      </div>

      <!--Right-->
      <div
        class="
          hidden
          lg:block
          w-full w-full
          sm:w-3/12
          pl-12
          right
          pt-nav-height
          relative
        "
      >
        <sticky>
          <transition name="fade" mode="out-in">
            <router-view name="right"></router-view>
          </transition>
          <br />
          <p class="text-xs"><b>©️ 2022 National Zakat Foundation</b></p>
        </sticky>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import Sticky from "./components/Sticky";
import queryString from "query-string";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import {
  paths,
  paymentTypes,
  sadaqahDisplayName,
  ribbahDisplayName,
  deliveryFeeTextNoAddOn,
  deliveryPercent,
} from "./utils/GlobalVars";
import ErrorMessage from "./components/ErrorMessage";
import FlashContainer from "./components/containers/FlashContainer";
import IeDetect from "./components/IeDetect";
import { calcPercentOfNum } from "./utils/helpers";
const BigNumber = require("bignumber.js");

export default {
  metaInfo: {
    meta: [
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
      },
    ],
  },
  name: "app",
  components: {
    NavBar,
    Sticky,
    ErrorMessage,
    FlashContainer,
    IeDetect,
  },
  methods: {
    setZakat(amount) {
      let zakat = this.donationTypes.filter((el) => el.id === 0);

      zakat[0].amount = amount;
      this.userZakat = amount;

      this.$store.dispatch("updateZakat", {
        name: "Zakat",
        amount: amount,
        paymentType: paymentTypes.single,
        id: 0,
      });

      let deliveryFee = new BigNumber(
        calcPercentOfNum(this.userZakat, deliveryPercent)
      );
      this.$store.dispatch("addDonation", {
        name: deliveryFeeTextNoAddOn,
        amount: deliveryFee,
        id: 3,
        paymentType: this.donationTypes[0].paymentType,
      });
    },
    setSession() {
      if (location.search !== "" && location.search !== null) {
        fetch("https://api.ipify.org?format=json")
          .then((x) => x.json())
          .then(({ ip }) => {
            var ua = this.$browserDetect;
            let payload = {
              _ip: ip,
              _uetsid: localStorage.getItem("_uetsid"),
              _uetsid_exp: localStorage.getItem("_uetsid_exp"),
              _uetvid: localStorage.getItem("_uetvid"),
              _uetvid_exp: localStorage.getItem("_uetvid_exp"),
              firstname: "",
              lastname: "",
              email: "",
              customerRef: "",
              URLString: location.search,
              dataObject: JSON.stringify(queryString.parse(location.search)),
              journyStatus: "Pending",
              uaName: ua.meta.name,
              ua: ua.meta.ua,
              uaVersion: ua.meta.version,
            };
            this.$store.dispatch("submitSessionData", payload);
          });
      }
    },
    checkEmpty(value) {
      let query = queryString.parse(location.search);
      return typeof query[value] !== "undefined" && query[value] !== null
        ? query[value]
        : "";
    },
    checkUndefine(value) {
      let query = queryString.parse(location.search);
      return typeof query[value] !== "undefined" ? true : false;
    },
    getURLEncodedData(method) {
      let payload = {
        zakat: this.checkEmpty("zakat"),
        zakatulfitr: this.checkEmpty("zakatulfitr"),
        fidya: this.checkEmpty("fidya"),
        sadaqah: this.checkEmpty("sadaqah"),
        riba: this.checkEmpty("riba"),
        giftaid: this.checkEmpty("giftaid"),
        mmz100: this.checkUndefine("mmz100"),
        title: this.checkEmpty("title"),
        fname: this.checkEmpty("fname"),
        lname: this.checkEmpty("lname"),
        company: this.checkEmpty("company"),
        email: this.checkEmpty("email"),
        phone: this.checkEmpty("phone"),
        postcodelookup: this.checkEmpty("postcodelookup"),
        addres1: this.checkEmpty("addres1"),
        addres2: this.checkEmpty("addres2"),
        city: this.checkEmpty("city"),
        country: this.checkEmpty("country"),
        postcode: this.checkEmpty("postcode"),
        memail: this.checkEmpty("memail") == 1 ? true : false,
        mpost: this.checkEmpty("mpost") == 1 ? true : false,
        msms: this.checkEmpty("msms") == 1 ? true : false,
        mphone: this.checkEmpty("mphone") == 1 ? true : false,
        whatiown: this.checkEmpty("whatiown"),
        whatiowe: this.checkEmpty("whatiowe"),
        calculationSettings: {
          showPension: false,
          pensionKnown: this.checkUndefine("pensionvalueknown")
            ? 1
            : this.checkUndefine("pensionvalueunknown")
            ? 2
            : 0,
          deliveryCost: this.checkUndefine("mmz100") ? 1 : 2,
        },
        assets: {
          gold: this.checkEmpty("gold"),
          silver: this.checkEmpty("silver"),
          cash: {
            inHand: this.checkEmpty("cashinhand"),
            inBank: this.checkEmpty("cashinbank"),
            sharesCapital: this.checkEmpty("sharesresell"),
            sharesDividend: this.checkEmpty("sharesother"),
            receivables: this.checkEmpty("businessreceivable"),
            cashIsa: this.checkEmpty("cashisa"),
            sharesInvestments: this.checkEmpty("isactf"),
            pension: "",
            crypto: this.checkEmpty("crypto"),
            cashOwedToYou: this.checkEmpty("whatiowe"),
            loanOwedToYou: this.checkEmpty("loanrepayment"),
            soldOwedToYou: this.checkEmpty("expectedfromsale"),
            other: [],
          },
          goldSilver: {
            other: [],
          },
          moneyOwed: {
            other: [],
          },
          crypto: {
            other: [],
          },
          investment: {
            other: [],
          },
          businessAssets: {
            cash: this.checkEmpty("businesscash"),
            receivables: this.checkEmpty("businessreceivable"),
            stock: this.checkEmpty("businessstock"),
            other: [],
          },
          liabilities: {
            housePayments: this.checkEmpty("mortgage"),
            bills: this.checkEmpty("utilitybills"),
            borrowed: this.checkEmpty("personalloan"),
            overdraft: this.checkEmpty("overdraft"),
            credit: this.checkEmpty("creditcard"),
            tax: this.checkEmpty("businessliabilities"),
            other: [],
          },
        },
      };
      this.$store.dispatch("saveURLEcodeedData", payload);
      if (method == 0) {
        if (
          payload.zakat == "" &&
          payload.zakatulfitr == "" &&
          payload.fidya == "" &&
          payload.sadaqah == "" &&
          payload.riba == ""
        ) {
          this.$store.dispatch("setProgressBar", {
            step: 0,
          });
          this.$router.push({ path: "calculator" });
        } else if (payload.giftaid == "") {
          this.$store.dispatch("setProgressBar", {
            step: 2,
          });
          this.$router.push({ path: "support" });
        } else if (
          (payload.zakat !== "" ||
            payload.zakatulfitr !== "" ||
            payload.fidya !== "") &&
          (payload.sadaqah !== "" || payload.riba !== "")
        ) {
          this.$store.dispatch("setProgressBar", {
            step: 3,
          });
          this.$router.push({ path: "payment" });
        } else if (payload.sadaqah !== "" || payload.riba !== "") {
          this.$store.dispatch("setProgressBar", {
            step: 3,
          });
          this.$router.push({ path: "payment" });
        }
      }
    },

    // Added gift-aid code here for timely execution
    removeGiftAid() {
      this.$store.commit('SET_GIFT_AID',{
            giftAidValue: 2,
            giftAidClicked: true,
            isTaxPayer: false,
            amount: 0
        })
        this.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                changeGiftAidOption: false
            })
            var that = this
        setTimeout(function(){ 
            that.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                changeGiftAidOption: true
            })
          }, 0);
    },
    addGiftAid() {
      this.$store.commit('SET_GIFT_AID',{
            giftAidValue: 1,
            giftAidClicked: true,
            isTaxPayer: true,
            amount: calcPercentOfNum(this.total(), 25)
        })
        this.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                changeGiftAidOption: false
            })
            var that = this
        setTimeout(function(){ 
            that.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                changeGiftAidOption: true
            })
          }, 0);
    },
    total() {
        return parseFloat(this.getRegularDonationsTotal()) + parseFloat(this.getSingleDonationsTotal());
    },


  },
  computed: {
    ...mapState({
      journyData: (state) => state,
      isNavOpen: (state) => state.transitions.isNavOpen,
      loadingText: (state) => state.loadingText,
      globalErrors: (state) => state.errors.globalErrors,
      PaymentMethod: (state) => state.settings.PaymentMethod,
      calculatorProgress: (state) => state.calculatorProgress,
    }),
    ...mapFields([
      "donation.donationTypes",
      "user.userZakat",
      "donation.donationSplit",
      "donation.allocation",
    ]),
    ...mapGetters([
        'getRegularDonationsTotal',
        'getSingleDonationsTotal',
        'getLabel'
    ]),
    paths() {
      return paths;
    },
  },
  mounted() {
    let path = "";
    let HoldLocalStorageURLPassing = false;
    if (
      window.location.href == "http://localhost:8080/" ||
      window.location.href == "http://192.168.1.115"
    ) {
      this.$router.push({ path: "calculator" });
      path = "calculator";
    } else {
      this.$router.push({ path: "calculator" });
      path = "calculator";
    }
    if (location.pathname === "/st-payment") {
      this.$router.push({ name: "st-payment-error" });
      path = "st-payment-error";
    } else {
      if ("give" in queryString.parse(location.search)) {
        this.$router.push({ path: "donation" }).catch(err => {});
        path = "donation";
        HoldLocalStorageURLPassing = true;
      } else if ("payment" in queryString.parse(location.search)) {
        this.$router.push({ path: "payment" });
        path = "payment";
        HoldLocalStorageURLPassing = true;
      } else if ("donation" in queryString.parse(location.search)) {
        this.$router.push({ path: "donation" }).catch(err => {});
        path = "donation";
        HoldLocalStorageURLPassing = true;
      } else if ("support" in queryString.parse(location.search)) {
        this.$router.push({ path: "support" });
        path = "support";
        HoldLocalStorageURLPassing = true;
      } else if ("give-more" in queryString.parse(location.search)) {
        this.$router.push({ path: "support" });
        path = "support";
        HoldLocalStorageURLPassing = true;
      } else if ("give-sadaqah" in queryString.parse(location.search)) {
        this.$router.push({ path: "support" });
        path = "support";
        HoldLocalStorageURLPassing = true;
      } else if ("thankyou" in queryString.parse(location.search)) {
        this.$router.push({ path: "thank-you" });
        path = "thank-you";
        HoldLocalStorageURLPassing = true;
      }
    }

    if ("zakat" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).zakat;
      this.setZakat(amount);
    }

    if ("sadaqah" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).sadaqah;

      this.$store.dispatch("addDonation", {
        name: sadaqahDisplayName,
        amount: amount,
        paymentType: paymentTypes.single,
        id: "2-sadaqah",
      });
    }

    if ("riba" in queryString.parse(location.search)) {
      let amount = queryString.parse(location.search).riba;

      this.$store.dispatch("addDonation", {
        name: ribbahDisplayName,
        amount: amount,
        paymentType: paymentTypes.single,
        id: "3-riba",
      });
    }
    let fast = "fast" in queryString.parse(location.search);

    // Gift-aid from query string implemented here.
    if(typeof queryString.parse(location.search).giftaid !== "undefined"){
        if(queryString.parse(location.search).giftaid == "yes"){
            this.addGiftAid()
        } else if(queryString.parse(location.search).giftaid == "no"){
            this.removeGiftAid()
        }
    }
    else {
      this.removeGiftAid()
    }

    this.setSession();

    let check = "user" in queryString.parse(location.search);
    let step = this.calculatorProgress;
    let amount = this.userZakat;
    if (fast) {
      this.getURLEncodedData(1);

      window.addEventListener("load", (event) => {
        this.setZakat(amount);
        if (this.allocation === "nzf") {
          this.$store.dispatch("setRecommendedDonation", this.donationSplit);
        } else {
          if (
            localStorage.getItem("journyData") !== null &&
            localStorage.getItem("journyData") !== "undefined"
          ) {
            let AllStates = JSON.parse(localStorage.getItem("journyData"));
            this.$store.dispatch(
              "setRecommendedDonation",
              AllStates.donation.donationSplit
            );
          }
        }
        let allocation = "allocation" in queryString.parse(location.search);
        if (allocation && path !== "donation") {
          this.$store.dispatch("setProgressBar", {
            step: 1,
          });
          this.$router.push({ path: "donation" }).catch(err => {});
        } else {
          if (fast && path !== "payment") {
            this.$store.dispatch("setProgressBar", {
              step: step,
            });
            this.$router.push({ path: "payment" });
          }
        }
      });
    }
    if (
      localStorage.getItem("journyData") !== null &&
      !check &&
      !HoldLocalStorageURLPassing &&
      !fast
    ) {
      // console.log(path)
      window.addEventListener("load", (event) => {
        this.setZakat(amount);
        if (this.allocation === "nzf") {
          this.$store.dispatch("setRecommendedDonation", this.donationSplit);
        } else {
          if (
            localStorage.getItem("journyData") !== null &&
            localStorage.getItem("journyData") !== "undefined"
          ) {
            let AllStates = JSON.parse(localStorage.getItem("journyData"));
            this.$store.dispatch(
              "setRecommendedDonation",
              AllStates.donation.donationSplit
            );
          }
        }
        if (step == 0 && path !== "calculator") {
          this.$store.dispatch("setProgressBar", {
            step: step,
          });
          this.$router.push({ path: "calculator" });
        } else if (step == 1 && path !== "donation") {
          this.$store.dispatch("setProgressBar", {
            step: step,
          });
          this.$router.push({ path: "donation" }).catch(err => {});
        } else if (step == 2 && path !== "support") {
          this.$store.dispatch("setProgressBar", {
            step: step,
          });
          this.$router.push({ path: "support" });
        } else if (step == 3 && path !== "payment") {
          this.$store.dispatch("setProgressBar", {
            step: step,
          });
          this.$router.push({ path: "payment" });
        }
      });
    } else if (check) {
      localStorage.removeItem("journyData");

      this.getURLEncodedData(0);
    }
    if (this.allocation === "nzf") {
      this.$store.dispatch("setRecommendedDonation", this.donationSplit);
    } else {
      if (
        localStorage.getItem("journyData") !== null &&
        localStorage.getItem("journyData") !== "undefined"
      ) {
        let AllStates = JSON.parse(localStorage.getItem("journyData"));
        this.$store.dispatch(
          "setRecommendedDonation",
          AllStates.donation.donationSplit
        );
      }
    }
  },
  beforeCreate() {
    if ("calculate" in queryString.parse(location.search)) {
      let ref = queryString.parse(location.search).ref;
      this.$store.dispatch("getCalculationJourny", { ref }).then((res) => {
        this.$store.dispatch("fetchData");
      });
    } else {
      let check = "user" in queryString.parse(location.search);
      if (!check) {
        this.$store.dispatch("updateUserJourny");
      } else {
        localStorage.removeItem("journyData");
      }
      this.$store.dispatch("fetchData");
    }

    let stScriptElement = document.createElement("script");
    stScriptElement.setAttribute(
      "src",
      "https://webservices.securetrading.net/js/v2/st.js"
    );
    document.head.appendChild(stScriptElement);

    let stripeScriptElement = document.createElement("script");
    stripeScriptElement.setAttribute("src", "https://js.stripe.com/v3/");
    document.head.appendChild(stripeScriptElement);

    let gocardlessScriptElement = document.createElement("script");
    gocardlessScriptElement.setAttribute(
      "src",
      "https://pay.gocardless.com/billing/static/dropin/v2/initialise.js"
    );
    document.head.appendChild(gocardlessScriptElement);

    // let givematchScriptElement = document.createElement("script");
    // givematchScriptElement.setAttribute(
    //   "src",
    //   "https://givematch.com/widget.js"
    // );
    // document.head.appendChild(givematchScriptElement);

    let paypalScriptElement = document.createElement("script");
    paypalScriptElement.setAttribute(
      "src",
      `https://www.paypal.com/sdk/js?client-id=${process.env.VUE_APP_PAYPAL_CLIENT_KEY}&disable-funding=credit,card,venmo,sofort&locale=en_GB&currency=GBP`
    );
    document.head.appendChild(paypalScriptElement);
  },
};
</script>

<style lang="scss">
/*DO NOT DELETE ME */
@media (max-width: 600px) {
  .container {
    max-width: 375px;
  }
}
</style>
