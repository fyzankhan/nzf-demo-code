<template>
  <div>
    <scroll-container>
      <full-page-slide
        gtagId="nzf-further"
        :next-btn="{ skip: false, conditional: true }"
        class="-first"
      >
        <upsell-list></upsell-list>
      </full-page-slide>

      <full-page-slide
        gtagId="gift-aid"
        :next-btn="{
          text: 'Continue',
          path: '/payment',
          conditional: giftAidClicked,
        }"
      >
        <p>
          <gift-aid @select="giftAidClicked = true"></gift-aid>
        </p>
      </full-page-slide>
    </scroll-container>
  </div>
</template>

<script>
import UpsellList from "../UpsellList";
import ScrollContainer from "../scroll/ScrollContainer";
import FullPageSlide from "../FullPageSlide";
import GiftAid from "../GiftAid";
import { mapGetters, mapState } from "vuex";
import { mapFields } from "vuex-map-fields";
import {
  zakatableAssets,
  totalLiabilities,
  roundToTwo,
  numberWithCommas,
} from "../../utils/helpers";

export default {
  name: "DonationPage",
  components: { FullPageSlide, UpsellList, ScrollContainer, GiftAid },
  data() {
    return {
      zakatableAssets: numberWithCommas(zakatableAssets()).toLocaleString(),
      totalLiabilities: numberWithCommas(totalLiabilities()),
      show: false,
    };
  },
  methods: {
    netAssets() {
      return roundToTwo(zakatableAssets() - totalLiabilities());
    },
    total() {
      return (
        parseFloat(this.getRegularDonationsTotal()) +
        parseFloat(this.getSingleDonationsTotal())
      );
    },
  },
  computed: {
    ukTaxPayer() {
      return "I am a UK tax payer";
    },
    notUkTaxPayer() {
      return "I am not a UK tax payer";
    },
    ...mapGetters([
      "getZakatDeliveryCost",
      "getZakat",
      "getTotalDonation",
      "getRegularDonationsTotal",
      "getSingleDonationsTotal",
      "getLabel",
    ]),
    ...mapState({
      allocation: (state) => state.donation.allocation,
      donationSplit: (state) => state.donation.donationSplit,
    }),
    ...mapFields([
      "donation.giftAidClicked",
      "donation.giftAid",
      "donation.donationSplit",
    ]),
    nissabValue() {
      return "260";
    },
    formatZakat() {
      return numberWithCommas(this.getZakat());
    },
  },
  mounted() {
    window.scrollTo(0, 0);
    this.$store.dispatch("SaveLocalStateData");
    if (this.allocation !== "custom" && this.allocation !== "even") {
      this.$store.dispatch("setRecommendedDonation", this.donationSplit);
    }
  },
  beforeMount() {
    this.$store.dispatch("SaveLocalStateData");
    // this.$store.dispatch('updateZakat', {amount:zakatCalc()});
  },
};
</script>

<style scoped>
</style>
