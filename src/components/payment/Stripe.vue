<template>
  <div class="credit-card-inputs" :class="{ complete }">
    <div class="w-full mb-2 sm:mb-0">
      <div
        class="
          flex flex-col
          justify-start
          align-center
          mb-4
          md:mb-8
          z-10
          transition-border
          text-input
        "
      >
        <div class="relative">
          <div
            class="focus:outline-none w-full input-container -small"
            :class="{ error: error }"
            id="card-element"
          ></div>
          <div class="error-container text-red-100 mt-4" id="card-errors"></div>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      complete: false,
      error: false,
      stripe: window.Stripe(process.env.VUE_APP_STRIPE_API_KEY),
      card: null,
      cardBrand: "",
      cardElement: "",
      stripeOptions: {
        // see https://stripe.com/docs/stripe.js#element-options for details
        hidePostalCode: true,
      },
    };
  },
  ...mapState({
    stripeError: (state) => state.stripeError,
  }),
  mounted() {
    var stripe = this.stripe;
    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
      },
    };
    this.card = elements.create("card", { style: style, hidePostalCode: true });
    this.card.mount("#card-element");
    this.$store.dispatch("updateStripeErrorData", {
      error: true,
    });
    // console.log(elements)
    this.cardElement = elements.getElement("card");
    this.cardElement.on("change", (event) => {
      let displayError = document.getElementById("card-errors");
      if (event.complete) {
        // enable payment button
        this.error = false;
        this.$store.dispatch("updateStripeErrorData", {
          error: false,
        });
        this.cardBrand = event.brand;
        displayError.textContent = "";
      } else if (event.error) {
        this.error = true;
        this.$store.dispatch("updateStripeErrorData", {
          error: true,
        });
        displayError.textContent = event.message;
      }
    });
  },
  destroyed() {
    this.cardElement.destroy();
  },
};
</script> 
 
<style>
.StripeElement {
  margin-top: -3px !important;
}
.stripe-card {
  width: 300px;
  border: 1px solid grey;
}
.stripe-card.complete {
  border-color: green;
}
</style> 