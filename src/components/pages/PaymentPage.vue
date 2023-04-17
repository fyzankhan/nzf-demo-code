<template>
  <scroll-container id="top">
    <div class="pt-32 pb-10 px-4" style="z-index: 30">
      <h1 class="header-2 header mb-3">{{ getLabel("Your details") }}</h1>

      <p class="mb-6">
        {{
          getLabel(
            "Please fill in your details below to complete your donation"
          )
        }}
      </p>

      <div class="w-full sm:w-1/2 mb-8 sm:pr-4">
        <div class="font-semibold text-gray font-semibold text-sm sm:text-lg">
          {{ getLabel("Title") }}
        </div>

        <select-input
          :options="titles"
          class="z-20"
          id="title"
          :small="true"
          :value="paymentDetails.title"
          errormessage="Required"
          :validators="{ required: v.required }"
          @click="setTitle"
          @errors="setValidate"
        ></select-input>
      </div>

      <div class="flex flex-col sm:flex-row sx:flex-row">
        <div class="w-full sm:w-1/2 sx:w-1/2 sm:mr-4">
          <text-input
            name="First name*"
            id="firstname"
            placeholder="Enter your name"
            :currency="false"
            v-model="paymentDetails.firstName"
            :validators="{ required: v.required }"
            errormessage="Please provide a first name"
            @errors="setValidate"
            :small="true"
          >
          </text-input>
        </div>

        <div class="w-full sm:w-1/2 sx:w-1/2 sm:ml-4 sm:ml-4 sx:ml-4">
          <text-input
            name="Last name*"
            id="lastname"
            placeholder="Enter your last name"
            :currency="false"
            v-model="paymentDetails.lastName"
            :validators="{ required: v.required }"
            errormessage="Please provide a last name"
            @errors="setValidate"
            :small="true"
          >
          </text-input>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:w-1/2 sm:pr-4">
          <text-input
            name="Company name"
            id="companyname"
            placeholder="Enter company name"
            :currency="false"
            v-model="paymentDetails.companyName"
            errormessage="Please provide a company name"
            @errors="setValidate"
            :small="true"
          >
          </text-input>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row sx:flex-row">
        <div class="w-full sm:w-1/2 sx:w-1/2 sm:mr-4">
          <text-input
            name="Email address*"
            id="emailaddress"
            placeholder="Enter your email address"
            :currency="false"
            v-model="paymentDetails.address.emailAddress"
            :validators="{ required: v.required, email: v.email }"
            errormessage="Please provide valid email"
            @errors="setValidate"
            :small="true"
          >
          </text-input>
        </div>

        <div class="w-full sm:w-1/2 sx:w-1/2 sm:ml-4 sx:ml-4">
          <text-input
            name="Phone number*"
            id="phonenumber"
            placeholder="Enter your phone number"
            :currency="false"
            type="number"
            v-model="paymentDetails.address.contactNumber"
            :validators="{
              required: v.required,
              phoneNumberCheck: v.phoneNumberCheck,
            }"
            errormessage="Please provide valid phone number"
            @errors="setValidate"
            :small="true"
          >
          </text-input>
        </div>
      </div>

      <div class="relative z-70">
        <address-finder
          @errors="setValidate"
          @open="addressOpen"
          :callback="enablePaypal"
        ></address-finder>
      </div>
    </div>

    <div
      class="regular-donation-container pb-6 px-4"
      v-if="this.getRegularDonationsTotal() > 0"
      style="z-index: 20"
      id="regular-payment"
    >
      <h2 class="header header-3 font-style-2 font-semibold">
        Give {{ format(parseFloat(getRegularDonationsTotal())) }}
        <span v-if="paymentDetails.paymentDuration === 'monthly'"
          >monthly
        </span>
        <span v-else>weekly</span>
      </h2>
      <div class="mb-4">
        <router-link
          :to="{ path: paths.directDebitGuarantee, hash: '#regular-payment' }"
          class="text-blue-100 font-semibold"
        >
          {{ getLabel("Direct Debit Guarantee") }}
        </router-link>
      </div>

      <div class="flex flex-col sm:flex-row sx:flex-row">
        <div class="w-full sm:w-1/2 sx:w-1/2 sm:mr-4">
          <div class="mb-1 text-gray font-semibold text-sm sm:text-lg mb-1">
            {{ getLabel("Payment start date*") }}
          </div>
          <date-picker @errors="setValidate"></date-picker>
        </div>
        <div class="w-full sm:w-1/2 sx:w-1/2 sm:mr-4">
          <img src="/static/img/ddgw.jpg" class="direct-debit" />
        </div>
      </div>

      <go-cardless
        :submitMainPayment="submitPayment"
        :checkValidation="checkValidation"
        :validates="validates"
        :errorsArr="errorsArr"
      ></go-cardless>
    </div>

    <div
      class="pb-6 sx:pb-1 xs:pb-1 px-4"
      v-if="this.getSingleDonationsTotal() > 0"
      style="z-index: 20"
      id="card-details"
    >
      <div class="header header-3 font-style-2 font-semibold mb-4">
        <span v-if="!getGateway('0')">{{ getLabel("We accept") }}</span
        ><span v-if="getGateway('0')">{{
          getLabel(
            "Pay one-off " + format(parseFloat(getSingleDonationsTotal()))
          )
        }}</span>
      </div>

      <div class="mb-6" v-if="!getGateway('0')">
        <div v-if="PaymentMethod == 'Stripe'">
          <img src="/static/img/icons8-visa.svg" alt="" style="float: left" />
          <img
            src="/static/img/icons8-mastercard.svg"
            alt=""
            style="padding-left: 7px; float: left"
          />
          <img
            src="/static/img/icons8-american-express.svg"
            alt=""
            style="padding-left: 7px; float: left"
          />
          <img
            src="/static/img/icons8-maestro.svg"
            alt=""
            style="padding-left: 7px"
          />
        </div>
        <div v-if="PaymentMethod == 'Secure Trading'">
          <img src="/static/img/icons8-visa.svg" alt="" style="float: left" />
          <img
            src="/static/img/icons8-mastercard.svg"
            alt=""
            style="padding-left: 7px"
          />
        </div>
      </div>

      <!-- <secure-trading></secure-trading> -->
      <div v-if="getGateway('paypal')">
        <payment-radio
          :buttons="buttons"
          name="paymentType"
          @change="changePaymentType"
          ref="radioStripe"
          :full-width="true"
        >
        </payment-radio>
      </div>
      <transition name="fade">
        <div v-if="payment == 'stripe'">
          <div v-if="PaymentMethod == 'Secure Trading'">
            <secure-trading></secure-trading>
          </div>
          <div v-if="!getGateway('paypal') && PaymentMethod == 'Stripe'">
            <stripe-checkout ref="stripe"></stripe-checkout>
          </div>
        </div>
      </transition>
    </div>
    <div class="pb-12 sx:pb-2 xs:pb-2 px-4">
      <p class="mb-10">
        {{
          getLabel("Select your preferred methods of contact for the future")
        }}
      </p>
      <checkbox
        class="mb-8"
        @update="optInCheckbox"
        :checkboxes="[
          { name: 'Email', value: 1, selected: paymentDetails.optIn.email },
          { name: 'Post', value: 2, selected: paymentDetails.optIn.post },
          { name: 'SMS', value: 3, selected: paymentDetails.optIn.sms },
          { name: 'Telephone', value: 4, selected: paymentDetails.optIn.phone },
        ]"
      >
      </checkbox>
      <div
        class="text-sm leading-normal mt-4"
        v-if="ContactTextCheck"
        v-html="ContactText"
      ></div>
    </div>

    <div
      class="w-full sm:w-1/2 sx:mb-10 xs:mb10 mb-40 px-4"
      v-if="payment == 'paypal'"
    >
      <div v-if="getGateway('paypal')">
        <div id="paypal-button"></div>
      </div>
      <spinner v-if="loadingPaypal"></spinner>
    </div>
    <div
      class="w-full sm:w-1/2 sx:mb-10 xs:mb10 mb-40 px-4"
      v-if="payment !== 'paypal'"
    >
      <btn
        id="complete-payment"
        :class="{ '-active': validates }"
        @click="submitPayment"
      >
        <span v-if="!loading" id="complete-payment-text">{{
          getLabel("Complete Payment")
        }}</span>
        <spinner v-else></spinner>
      </btn>
    </div>
    <div class="pb-12 px-4">
      <p class="text-sm leading-normal">
        Your details are safe with us and you can withdraw consent at any time
        via
        <a
          class="text-blue-100"
          href="https://nzf.org.uk/about-nzf/get-in-touch/?utm_campaign=give-consent&utm_medium=payment&utm_source=giveapp&utm_content=application"
          >Get in touch</a
        >. Check out our
        <a
          class="text-blue-100"
          href="https://nzf.org.uk/privacy-policy/"
          target="_blank"
          >Privacy Policy</a
        >.
      </p>
    </div>

    <flash-container>
      <transition name="fade">
        <error-message v-if="errors">
          <span v-if="msg.length > 0">
            {{ msg }}
          </span>
          <span v-else> Please check your payment details </span>
        </error-message>
      </transition>
    </flash-container>
  </scroll-container>
</template>

<script>
import AddressFinder from "../AddressFinder";
import ScrollContainer from "../scroll/ScrollContainer";
import SelectInput from "../inputs/SelectInput";
import DatePicker from "../inputs/DatePicker";
import FlashContainer from "../containers/FlashContainer";
import SecureTrading from "../payment/SecureTrading";
import StripeCheckout from "../payment/Stripe";
import GoCardless from "../payment/GoCardless";
import TextInput from "../inputs/TextInput";
import Btn from "../inputs/Btn";
import Checkbox from "../inputs/Checkbox";
import Spinner from "../Spinner";
import { currencyFormat } from "../../utils/helpers";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import { EventBus } from "../../utils/eventBus.js";
import { reducer } from "../../utils/helpers.js";
import ErrorMessage from "../ErrorMessage";
import validators from "../../utils/validators";
import moment from "moment";
import { deliveryFeeText, paths } from "../../utils/GlobalVars";
import queryString from "query-string";
import PaymentRadio from "../inputs/PaymentRadio";

export default {
  name: "PaymentPage",
  components: {
    AddressFinder,
    ScrollContainer,
    SelectInput,
    TextInput,
    Checkbox,
    Btn,
    SecureTrading,
    StripeCheckout,
    Spinner,
    ErrorMessage,
    DatePicker,
    FlashContainer,
    PaymentRadio,
    GoCardless,
  },
  data() {
    return {
      titles: ["Mr", "Mrs", "Ms", "Miss", "Dr"],
      paymentTypes: ["Direct Debit", "Card"],
      address: false,
      validates: false,
      payment: "stripe",
      loadingPaypal: false,
      paypalActions: "",
      errorsArr: [],
    };
  },
  methods: {
    getGateway(val) {
      if (val == "0") {
        let gate = this.gateways.filter((itm) =>
          itm.active == "Yes" ? true : false
        );

        if (gate.length > 0) {
          return true;
        } else {
          return false;
        }
      }
      let gate = this.gateways.filter((itm) => itm.alias == val);
      if (gate.length > 0) {
        return gate[0].active == "Yes" ? true : false;
      } else {
        return false;
      }
    },
    format(num) {
      return num ? currencyFormat(num) : "";
    },
    changePaymentType(val) {
      if (val == "paypal" && this.payment !== val) {
        this.loadingPaypal = true;
        setTimeout(() => {
          this.initPaypal();
        }, 500);
      }
      this.payment = val;
    },
    checkEmpty(value) {
      let query = queryString.parse(location.search);
      return typeof query[value] !== "undefined" && query[value] !== null
        ? query[value]
        : "";
    },
    getValidateElements() {
      return [
        document.getElementById("title"),
        document.getElementById("firstname"),
        document.getElementById("lastname"),
        document.getElementById("companyname"),
        document.getElementById("emailaddress"),
        document.getElementById("phonenumber"),
        document.getElementById("postcodelockup"),
        document.getElementById("addresslineone"),
        document.getElementById("addresslinetwo"),
        document.getElementById("city"),
        document.getElementById("country"),
        document.getElementById("postcode"),
        document.getElementById("accountholdername"),
        document.getElementById("accountnumber"),
        document.getElementById("bankshortcode"),
        document.getElementById("regulardonationdateselect"),
      ];
    },
    uuidv4() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    async initPaypal() {
      let total = parseFloat(this.getSingleDonationsTotal());
      let that = this;
      let uuid = "";
      window.paypal
        .Buttons({
          locale: "en_GB",
          style: {
            layout: "vertical",
            color: "blue",
            shape: "pill",
            label: "paypal",
          },
          // onInit is called when the button first renders
          onInit: function (data, actions) {
            // Disable the buttons
            actions.disable();
            that.paypalActions = actions;
            that.checkValidation(actions, 1);
            let elements = that.getValidateElements();
            elements.forEach((item) => {
              if (typeof item !== "undefined" && item !== null) {
                item.addEventListener("change", (event) => {
                  that.checkValidation(actions, 0);
                });
              }
            });
          },
          // onClick is called when the button is clicked
          onClick: function () {
            that.checkValidation(that.paypalActions, 1);
            // Show a validation error if the checkbox is not checked
            //    that.paypalActions.enable();
            //    document.getElementById("paypal-button").click();
          },
          createOrder: function (data, actions) {
            uuid = that.uuidv4();
            // This function sets up the details of the transaction, including the amount and line item details.
            const orderDetails = actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: total,
                    currency: "GBP",
                  },
                  reference_id: "ref-" + uuid,
                  invoice_id: uuid,
                  custom_id: "pi_" + uuid,
                },
              ],
            });
            let payload = {
              secret: "pi_" + uuid,
            };
            that.$store.dispatch("savePaymentInDB", payload);
            return orderDetails;
          },
          onApprove: function (data, actions) {
            // This function captures the funds from the transaction.
            return actions.order.capture().then(function (details) {
              // This function shows a transaction success message to your buyer.
              // alert('Transaction completed by ' + details.payer.name.given_name);
              /***************START*****************/
              that.addProductsInGoogleAnalytics();
              let payload = {
                card: "Paypal",
                secret: uuid,
                paymentMethod: "Paypal",
                utm_campaign: that.checkEmpty("utm_campaign"),
                utm_medium: that.checkEmpty("utm_medium"),
                utm_source: that.checkEmpty("utm_source"),
                utm_content: that.checkEmpty("utm_content"),
              };
              that.$store.dispatch("MarkPaymentInCMS", payload).then((res) => {
                if (res.status == 200) {
                  if (location.search !== "" && location.search !== null) {
                    let payload = {
                      _ip: that._ip,
                      _uetsid: localStorage.getItem("_uetsid"),
                      _uetsid_exp: localStorage.getItem("_uetsid_exp"),
                      _uetvid: localStorage.getItem("_uetvid"),
                      _uetvid_exp: localStorage.getItem("_uetvid_exp"),
                      firstname: that.paymentDetails.firstName,
                      lastname: that.paymentDetails.lastName,
                      email: that.paymentDetails.address.emailAddress,
                      URLString: location.search,
                      dataObject: JSON.stringify(
                        queryString.parse(location.search)
                      ),
                      customerRef:
                        typeof that.customerRef.data.customer !== "undefined"
                          ? that.customerRef.data.customer.ref
                          : null,
                      journyStatus: "Completed",
                    };
                    that.$store.dispatch("submitSessionData", payload);
                  }
                  that.loading = false;
                  that.msg = "";
                  that.$router.push({ path: "/thank-you" });
                } else {
                  that.loading = false;
                  that.msg = "";
                  that.errorMsg("Error processing payment details");
                }
              });
              /***************END*****************/
            });
          },
        })
        .render("#paypal-button");
      this.loadingPaypal = false;
    },
    checkValidation(actions, status) {
      this.$store.dispatch("SaveLocalStateData");
      if (this.loading) {
        return true;
      }

      const regex = /[‘´ʼʹ’]/gi;

      this.paymentDetails.accountHolderName =
        this.paymentDetails.accountHolderName.replace(regex, "'");
      this.paymentDetails.firstName = this.paymentDetails.firstName.replace(
        regex,
        "'"
      );
      this.paymentDetails.lastName = this.paymentDetails.lastName.replace(
        regex,
        "'"
      );

      this.setLocalStorage();

      if (
        this.getSingleDonationsTotal() == 0 &&
        this.getRegularDonationsTotal() == 0
      ) {
        if (status == 1) {
          this.errorMsg("Basket is empty");
          this.$scrollTo("#regular-payment", 500, { offset: -175 });
        }
        return;
      } else if (this.regularZakat + this.regularNoZakat > 800) {
        if (status == 1) {
          this.errorMsg("Regular payments must be below £800");
        }
        return;
      } else if (
        this.regularNoZakat + this.regularZakat > 0 &&
        this.regularNoZakat + this.regularZakat < 1
      ) {
        if (status == 1) {
          this.errorMsg("Regular payments must be at least £1.");
        }
        return;
      }

      this.emitCheckValidation();

      this.loading = true;
      setTimeout(async () => {
        let scrollId =
          this.errorsArr.filter((el) => el.error).length > 0
            ? this.errorsArr.filter((el) => el.error)[0].id
            : "top";
        this.loading = false;
        if (this.validates) {
          if (status !== 3) {
            actions.enable();
          } else {
            return;
          }
        } else {
          if (status !== 3) {
            actions.disable();
          } else {
            return;
          }
          if (status == 1) {
            this.errorMsg("Please check required fields");
            this.$scrollTo("#" + scrollId, 500, { offset: -175 });
          }
        }
      }, 5);
    },
    formatAccountName(val) {
      const regex = /[‘´ʼʹ’]/gi;

      let accName = val.replace(regex, "'");

      this.paymentDetails.accountHolderName = accName;
    },
    addressOpen() {
      this.address = true;
    },
    enablePaypal() {
      if (this.paypalActions) {
        this.paypalActions.enable();
      }
    },
    emit(eventName) {
      return new Promise((resolve, reject) => {
        this.$emit(eventName);
        this.$nextTick(resolve);
      });
    },
    async emitCheckValidation() {
      await EventBus.$emit("checkValidation");
    },
    addProductsInGoogleAnalytics() {
      if (
        window.location.href !== "http://localhost:8080/" ||
        window.location.href !== "http://192.168.1.115" ||
        window.location.href !== "http://nzf.pnpd.co.uk" ||
        window.location.href !== "http://nzforg.wixdek.com/" ||
        window.location.href !== "https://ghost.nzf.org.uk/"
      ) {
        // Products Add To Cart
        let singles = this.getSingleDonations();
        let products = [];
        var i = 1;
        for (const single of singles) {
          if (
            single.name !== "Support cost" &&
            single.name !== "Hardship Relief" &&
            single.name !== "Housing & Work" &&
            single.name !== "Education"
          ) {
            if (
              single.name == "Zakat" ||
              single.name == "Zakat ul Fitr" ||
              single.name == "Fidyah/Kaffarah"
            ) {
              products.push({
                id: single.name,
                name: single.name,
                price: single.amount,
                category: "Give Zakat",
                list_name: "Give Zakat",
                list_position: i,
                quantity: 1,
              });
              i++;
            } else if (
              single.name == "Sadaqah (voluntary donation)" ||
              single.name == "Riba (interest)"
            ) {
              products.push({
                id: single.name,
                name: single.name,
                price: single.amount,
                category: "Give Sadaqah",
                list_name: "Give Sadaqah",
                list_position: i,
                quantity: 1,
              });
              i++;
            }
          }
        }
        // Products Add To Cart
        let regulars = this.getRegularDonations();
        for (const regular of regulars) {
          if (
            regular.name !== "Support cost" &&
            regular.name !== "Hardship Relief" &&
            regular.name !== "Housing & Work" &&
            regular.name !== "Education"
          ) {
            if (
              regular.name == "Zakat" ||
              regular.name == "Zakat ul Fitr" ||
              regular.name == "Fidyah/Kaffarah"
            ) {
              products.push({
                id: regular.name,
                name: regular.name,
                price: regular.amount,
                category: "Give Zakat",
                list_name: "Give Zakat",
                list_position: i,
                quantity: 1,
              });
              i++;
            } else if (
              regular.name == "Sadaqah (voluntary donation)" ||
              regular.name == "Riba (interest)"
            ) {
              products.push({
                id: regular.name,
                name: regular.name,
                price: regular.amount,
                category: "Give Sadaqah",
                list_name: "Give Sadaqah",
                list_position: i,
                quantity: 1,
              });
              i++;
            }
          }
        }
        let total =
          parseFloat(this.getSingleDonationsTotal()) +
          parseFloat(this.getRegularDonationsTotal());
        localStorage.setItem("products", JSON.stringify(products));
        localStorage.setItem("total", total);
      }
    },
    async submitPayment() {
      this.$store.dispatch("SaveLocalStateData");
      if (this.loading) {
        return true;
      }

      const regex = /[‘´ʼʹ’]/gi;

      this.paymentDetails.accountHolderName =
        this.paymentDetails.accountHolderName.replace(regex, "'");
      this.paymentDetails.firstName = this.paymentDetails.firstName.replace(
        regex,
        "'"
      );
      this.paymentDetails.lastName = this.paymentDetails.lastName.replace(
        regex,
        "'"
      );

      this.setLocalStorage();

      if (
        this.getSingleDonationsTotal() == 0 &&
        this.getRegularDonationsTotal() == 0
      ) {
        this.errorMsg("Basket is empty");
        this.$scrollTo("#regular-payment", 500, { offset: -175 });
        return;
      } else if (this.regularZakat + this.regularNoZakat > 800) {
        this.errorMsg("Regular payments must be below £800");
        return;
      } else if (
        this.regularNoZakat + this.regularZakat > 0 &&
        this.regularNoZakat + this.regularZakat < 1
      ) {
        this.errorMsg("Regular payments must be at least £1.");
        return;
      }

      this.emitCheckValidation();

      this.loading = true;

      setTimeout(async () => {
        let scrollId =
          this.errorsArr.filter((el) => el.error).length > 0
            ? this.errorsArr.filter((el) => el.error)[0].id
            : "top";

        if (this.validates) {
          this.addProductsInGoogleAnalytics();

          if (this.getSingleDonationsTotal() > 0) {
            if (this.PaymentMethod == "Stripe") {
              if (!this.stripeError) {
                var stripe;
                if (!this.getGateway("paypal")) {
                  stripe = this.$refs.stripe;
                } else {
                  stripe = this.$refs.radioStripe.$refs.stripe[0];
                }

                let payload = {
                  card: stripe.card,
                  brand: stripe.cardBrand,
                  utm_campaign: this.checkEmpty("utm_campaign"),
                  utm_medium: this.checkEmpty("utm_medium"),
                  utm_source: this.checkEmpty("utm_source"),
                  utm_content: this.checkEmpty("utm_content"),
                };
                this.$store
                  .dispatch("stripePIDonation", payload)
                  .then((res) => {
                    if (res.status == 200) {
                      if (typeof res.data.message !== "undefined") {
                        this.errorMsg(res.data.message);
                      } else {
                        // Make stripe payment with Payment Intent ID
                        let secret = res.data.client_secret;
                        let name =
                          this.paymentDetails.firstName +
                          " " +
                          this.paymentDetails.lastName;
                        let that = this;
                        stripe.stripe
                          .confirmCardPayment(secret, {
                            payment_method: {
                              card: stripe.card,
                              billing_details: {
                                name: name,
                              },
                            },
                          })
                          .then(function (result) {
                            if (result.error) {
                              that.errorMsg(result.error);
                            } else {
                              // The payment has been processed!
                              if (result.paymentIntent.status === "succeeded") {
                                payload.secret = secret;
                                payload.paymentMethod = "Stripe";
                                that.$store
                                  .dispatch("MarkPaymentInCMS", payload)
                                  .then((res) => {
                                    if (res.status == 200) {
                                      if (
                                        location.search !== "" &&
                                        location.search !== null
                                      ) {
                                        let payload = {
                                          _ip: that._ip,
                                          _uetsid:
                                            localStorage.getItem("_uetsid"),
                                          _uetsid_exp:
                                            localStorage.getItem("_uetsid_exp"),
                                          _uetvid:
                                            localStorage.getItem("_uetvid"),
                                          _uetvid_exp:
                                            localStorage.getItem("_uetvid_exp"),
                                          firstname:
                                            that.paymentDetails.firstName,
                                          lastname:
                                            that.paymentDetails.lastName,
                                          email:
                                            that.paymentDetails.address
                                              .emailAddress,
                                          URLString: location.search,
                                          dataObject: JSON.stringify(
                                            queryString.parse(location.search)
                                          ),
                                          customerRef:
                                            typeof that.customerRef.data
                                              .customer !== "undefined"
                                              ? that.customerRef.data.customer
                                                  .ref
                                              : null,
                                          journyStatus: "Completed",
                                        };
                                        that.$store.dispatch(
                                          "submitSessionData",
                                          payload
                                        );
                                      }
                                      that.loading = false;
                                      that.msg = "";
                                      that.$router.push({ path: "/thank-you" });
                                    } else {
                                      that.loading = false;
                                      that.msg = "";
                                      that.errorMsg(
                                        "Error processing payment details"
                                      );
                                    }
                                  });

                                // that.loading = false;
                                // that.msg = '';

                                // that.$router.push({ path: '/thank-you' });
                                // Show a success message to your customer
                                // There's a risk of the customer closing the window before callback
                                // execution. Set up a webhook or plugin to listen for the
                                // payment_intent.succeeded event that handles any business critical
                                // post-payment actions.
                              }
                            }
                          });
                        // ********END**********
                      }
                    } else {
                      if (typeof res.data.message !== "undefined") {
                        this.errorMsg(res.data.message);
                      } else {
                        this.errorMsg("Error processing payment details");
                      }
                    }
                  })
                  .catch((e) => {
                    if (typeof e.message !== "undefined") {
                      this.errorMsg(e.message);
                    } else {
                      this.errorMsg("Error processing payment details");
                    }
                  });
              } else {
                this.loading = false;
                this.msg = "";
                this.$scrollTo("#card-element", 500, { offset: -175 });
                this.errorMsg("Please check one-off payment details");
              }
            } else if (this.PaymentMethod == "Secure Trading") {
              EventBus.$emit("submitPayment");
            }
          }
          // if(
          //     this.getRegularDonationsTotal() > 0 &&
          //     this.paymentDetails.accountNumber.length >= 8 &&
          //     this.paymentDetails.bankSortCode >= 6 &&
          //     this.paymentDetails.accountHolderName.length > 0 &&
          //     this.paymentDetails.paymentStartDate.length > 0) {
          else if (
            this.getRegularDonationsTotal() > 0 &&
            this.paymentDetails.paymentStartDate.length > 0
          ) {
            if (
              this.paymentDetails.payerAuthId &&
              this.paymentDetails.payerAuthId !== ""
            ) {
              this.loading = true;
              this.$store
                .dispatch("submitDirectDebitPayment")
                .then((res) => {
                  this.msg = "";
                  this.$router.push({ path: "/thank-you" });
                })
                .catch((err) => {
                  this.errorMsg("Please check regular payment details");
                  this.$scrollTo("#regular-payment", 500, { offset: -75 });
                });
            } else {
              this.errorMsg("Please setup direct debit");
              this.$scrollTo("#regular-payment", 500, { offset: -175 });
            }
          } else {
            this.errorMsg("Please check regular payment details");
            this.$scrollTo("#regular-payment", 500, { offset: -175 });
          }
        } else {
          this.errorMsg("Please check required fields");
          this.$scrollTo("#" + scrollId, 500, { offset: -175 });
        }
      }, 5);
    },
    errorMsg(msg) {
      this.loading = false;
      this.errors = true;
      this.msg = msg;

      setTimeout(() => {
        this.errors = false;
        this.msg = "";
      }, 5000);
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
    contactCheckbox(val) {
      this.paymentDetails.contactSubject = val;
    },
    setTitle(title) {
      this.paymentDetails.title = title;
    },
    optInCheckbox(val) {
      // {name:'Email', value: 1},
      this.paymentDetails.optIn.email = val.includes(1);
      // {name:'Post', value: 2},
      this.paymentDetails.optIn.post = val.includes(2);
      // {name:'SMS', value: 3},
      this.paymentDetails.optIn.sms = val.includes(3);
      // {name:'Telephone', value: 4},
      this.paymentDetails.optIn.phone = val.includes(4);

      this.paymentDetails.optIn.whatsapp = val.includes(5);

      this.paymentDetails.optIn.telegram = val.includes(6);
    },
    setLocalStorage() {
      localStorage.setItem("basket", JSON.stringify(this.donationTypes));
      localStorage.setItem("donationSplit", JSON.stringify(this.donationSplit));

      localStorage.setItem(
        "address",
        JSON.stringify({
          postCode: this.paymentDetails.postCode,
          address: {
            ...this.paymentDetails.address,
          },
        })
      );

      localStorage.setItem(
        "giftAid",
        JSON.stringify({ giftAid: this.giftAid })
      );

      let accNum = String(this.paymentDetails.accountNumber);

      localStorage.setItem(
        "accountNumber",
        JSON.stringify({
          accountNumber: accNum.substring(accNum.length - 3),
        })
      );
    },
    openNav() {
      EventBus.$emit("openMobileNav");
    },
  },
  computed: {
    ...mapFields([
      "user.paymentDetails",
      "user.cardDetails.maskedpan",
      "paymentSubmit.loading",
      "paymentSubmit.errors",
      "paymentSubmit.msg",
      "flash.success",
      "donation.giftAid",
      "donation.donationSplit",
    ]),
    ...mapGetters([
      "getLabel",
      "getSingleDonations",
      "getSingleDonationsTotal",
      "getRegularDonationsTotal",
      "getRegularDonations",
    ]),
    ...mapState({
      journyData: (state) => state,
      allocation: (state) => state.donation.allocation,
      gateways: (state) => state.gateways,
      donationTypes: (state) => state.donation.donationTypes,
      donationSplit: (state) => state.donation.donationSplit,
      ContactTextCheck: (state) =>
        state.settings.ContactTextCheck == 1 ? true : false,
      PaymentMethod: (state) => state.settings.PaymentMethod,
      ContactText: (state) => state.settings.ContactText,
      stripe: (state) => state.stripe,
      _ip: (state) => state.user._ip,
      customerRef: (state) => state.customerRef,
      stripeError: (state) => state.stripeError,
    }),
    paths() {
      return paths;
    },
    v() {
      return { ...validators };
    },
    buttons() {
      return [
        {
          name: "Debit or credit card",
          value: "stripe",
          selected: this.payment == "stripe" ? true : false,
        },
        {
          name: "Paypal",
          value: "paypal",
          selected: this.payment == "paypal" ? true : false,
        },
      ];
    },
    regularNoZakat() {
      let regArr = this.getRegularDonations()
        .filter((el) => {
          if (el.id !== 0) {
            if (el.id === 3) {
              if (el.name === deliveryFeeText) {
                return el.amount;
              } else {
                return 0;
              }
            } else {
              return el.amount;
            }
          }
          return 0.0;
        })
        .map((el) => el.amount);

      if (regArr.length > 0) {
        return regArr.reduce(reducer);
      }

      return false;
    },
    regularZakat() {
      let regZakat = this.getRegularDonations().filter((el) => el.id == 0);

      if (regZakat.length > 0) {
        return regZakat[0].amount;
      }

      return false;
    },
    formettedDate() {
      if (this.paymentDetails.paymentStartDate) {
        return moment(this.paymentDetails.paymentStartDate, "YY-MM-DD").format(
          "DD/MM/YY"
        );
      }

      return "";
    },
  },
  mounted() {
    if (this.$route.hash) {
      this.$scrollTo(this.$route.hash, 1, { offset: -200 });
    } else {
      window.scrollTo(0, 0);
    }
    if (this.allocation !== "custom" && this.allocation !== "even") {
      this.$store.dispatch("setRecommendedDonation", this.donationSplit);
    }
    this.$store.dispatch("convertToNum");

    this.loading = false;

    if (
      window.location.href !== "http://localhost:8080/" ||
      window.location.href !== "http://192.168.1.115" ||
      window.location.href !== "http://nzf.pnpd.co.uk" ||
      window.location.href !== "http://nzforg.wixdek.com/" ||
      window.location.href !== "https://ghost.nzf.org.uk/"
    ) {
      localStorage.removeItem("products");
      localStorage.removeItem("total");
      // Products Add To Cart
      let singles = this.getSingleDonations();
      let products = [];
      var i = 1;
      for (const single of singles) {
        if (
          single.name !== "Support cost" &&
          single.name !== "Hardship Relief" &&
          single.name !== "Housing & Work" &&
          single.name !== "Education"
        ) {
          if (
            single.name == "Zakat" ||
            single.name == "Zakat ul Fitr" ||
            single.name == "Fidyah/Kaffarah"
          ) {
            products.push({
              id: single.name,
              name: single.name,
              price: single.amount,
              category: "Give Zakat",
              list_name: "Give Zakat",
              list_position: i,
              quantity: 1,
            });
            i++;
          } else if (
            single.name == "Sadaqah (voluntary donation)" ||
            single.name == "Riba (interest)"
          ) {
            products.push({
              id: single.name,
              name: single.name,
              price: single.amount,
              category: "Give Sadaqah",
              list_name: "Give Sadaqah",
              list_position: i,
              quantity: 1,
            });
            i++;
          }
        }
      }
      // Products Add To Cart
      let regulars = this.getRegularDonations();
      for (const regular of regulars) {
        if (
          regular.name !== "Support cost" &&
          regular.name !== "Hardship Relief" &&
          regular.name !== "Housing & Work" &&
          regular.name !== "Education"
        ) {
          if (
            regular.name == "Zakat" ||
            regular.name == "Zakat ul Fitr" ||
            regular.name == "Fidyah/Kaffarah"
          ) {
            products.push({
              id: regular.name,
              name: regular.name,
              price: regular.amount,
              category: "Give Zakat",
              list_name: "Give Zakat",
              list_position: i,
              quantity: 1,
            });
            i++;
          } else if (
            regular.name == "Sadaqah (voluntary donation)" ||
            regular.name == "Riba (interest)"
          ) {
            products.push({
              id: regular.name,
              name: regular.name,
              price: regular.amount,
              category: "Give Sadaqah",
              list_name: "Give Sadaqah",
              list_position: i,
              quantity: 1,
            });
            i++;
          }
        }
      }
      let total =
        parseFloat(this.getSingleDonationsTotal()) +
        parseFloat(this.getRegularDonationsTotal());
      this.$gtag.query("event", "begin_checkout", {
        items: products,
      });
      this.$gtag.query("event", "checkout_progress", {
        currency: "GBP",
        checkout_option: "Finish!",
        checkout_step: 4,
        value: total,
        items: products,
      });
    }
    this.$store.dispatch("SaveLocalStateData");
  },
  beforeDestroy() {
    this.errors = false;
    this.$store.commit("SET_SUCCESS_MSG", "");
    this.$store.dispatch("SaveLocalStateData");
  },
};
</script>
<style scoped lang="scss">
.direct-debit {
  width: 100px;
  height: 50px;
  margin: 24px 0px 0px 70px;
}
</style>