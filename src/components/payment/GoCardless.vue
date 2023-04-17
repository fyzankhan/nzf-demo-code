<template>
  <div>
    <div class="flex flex-col sm:flex-row sx:flex-row">
      <div class="w-full sm:w-1/2 sx:mb-10 xs:mb10 mb-40 px-4">
        <btn
          id="payment-type"
          :class="paymentDuration == 'monthly' ? '-active' : ''"
          @click="paymentType('monthly')"
        >
          <span>Monthly</span>
        </btn>
      </div>
      <div class="w-full sm:w-1/2 sx:mb-10 xs:mb10 mb-40 px-4">
        <btn
          id="payment-type"
          :class="paymentDuration == 'weekly' ? '-active' : ''"
          @click="paymentType('weekly')"
        >
          <span>Weekly</span>
        </btn>
      </div>
    </div>
    <div class="flex flex-col sm:flex-row sx:flex-row">
      <div class="w-full sm:w-1/2 sx:mb-10 xs:mb10 mb-40 px-4">
        <btn
          id="complete-payment"
          :disabled="true"
          :class="
            paymentDetails.payerAuthId && paymentDetails.payerAuthId !== ''
              ? ''
              : '-active'
          "
          @click="submitPayment"
        >
          <span v-if="!loadingButton" id="complete-payment-text"
            >Setup Direct Debit</span
          >
          <spinner v-else></spinner>
        </btn>
        <!-- <btn id="complete-payment" v-else>
          <spinner></spinner>
        </btn> -->
      </div>
    </div>
  </div>
</template>
 
<script>
import Btn from "../inputs/Btn";
import { mapFields } from "vuex-map-fields";
import Spinner from "../Spinner";
import { mapGetters, mapState } from "vuex";

export default {
  name: "GoCardless",
  components: { Btn, Spinner },
  props: ["submitMainPayment", "checkValidation", "validates", "errorsArr"],
  data() {
    return {
      complete: false,
      loadingButton: false,
      paymentDuration: "monthly",
      billingRequestFlowID: "",
    };
  },
  methods: {
    paymentType(type) {
      this.paymentDuration = type;
      this.paymentDetails.paymentDuration = type;
    },
    submitPayment() {
      this.checkValidation({}, 3);
      setTimeout(async () => {
        if (this.validates) {
          if (
            this.paymentDetails.payerAuthId &&
            this.paymentDetails.payerAuthId !== ""
          ) {
            this.errorMsg("Direct Debit already setup");
          } else {
            this.loadingButton = true;
            let that = this;
            if (
              this.getRegularDonationsTotal() > 0 &&
              this.billingRequestFlowID === ""
            ) {
              this.$store.dispatch("getBillingFlowID").then((res) => {
                that.billingRequestFlowID = res.data.flowId;
              });
            } else {
              const handler = window.GoCardlessDropin.create({
                billingRequestFlowID: that.billingRequestFlowID,
                environment: process.env.VUE_APP_GO_CARDLESS, // either live or sandbox
                metadata: [{ title: "Tahir" }],
                onSuccess: (billingRequest, billingRequestFlow) => {
                  let mandate = billingRequest.mandate_request.links.mandate;
                  that.paymentDetails.payerAuthId = mandate;

                  if (that.getSingleDonationsTotal() > 0) {
                    if (that.PaymentMethod == "Stripe") {
                      if (!that.stripeError) {
                        that.submitMainPayment();
                      }
                    }
                  } else if (that.getSingleDonationsTotal() <= 0) {
                    that.submitMainPayment();
                  }
                  that.loadingButton = false;
                },
                onExit: (error, metadata) => {
                  that.loadingButton = false;
                },
              });
              handler.open();
            }
          }
        } else {
          let scrollId =
            this.errorsArr.filter((el) => el.error).length > 0
              ? this.errorsArr.filter((el) => el.error)[0].id
              : "top";
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
  },
  watch: {
    billingRequestFlowID(newBillingflowId, oldBillingflowId) {
      if (this.getRegularDonationsTotal() > 0 && newBillingflowId !== "") {
        this.submitPayment();
      }
    },
  },
  computed: {
    ...mapFields([
      "user.paymentDetails",
      "user.billingflowId",
      "paymentSubmit.loading",
      "paymentSubmit.errors",
      "paymentSubmit.msg",
    ]),
    ...mapGetters(["getRegularDonationsTotal", "getSingleDonationsTotal"]),
    ...mapState({
      PaymentMethod: (state) => state.settings.PaymentMethod,
      stripeError: (state) => state.stripeError,
    }),
  },
  mounted() {
    this.paymentDetails.paymentDuration = this.paymentDuration;
  },
  destroyed() {},
};
</script> 
 
<style>
.iframeId {
  height: 100% !important;
}
iframe {
  height: 100% !important;
}
#payment-type {
  margin-top: 30px;
}
#complete-payment {
  margin-top: 10px;
}
</style> 