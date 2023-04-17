<template>
  <div class="nav-bar">
    <div
      class="w-full fixed top-0 nav-container"
      :class="{ '-hide-nav': scrollDirection == 'down' }"
    >
      <div class="shadow-nav bg-white px-4 z-30 relative">
        <div
          class="
            container
            flex
            justify-between
            items-center
            py-4
            m-auto
            nav-inner
          "
        >
          <div class="mr-6 md:w-1/5 logo">
            <div
              class="hidden md:block h-full cursor-pointer"
              style="max-width: 160px"
              @click="closeSite"
            >
              <img
                src="/static/img/nzf-logo.svg"
                alt=""
                class="desktop-image"
              />
            </div>

            <div
              class="block md:hidden h-full cursor-pointer"
              @click="closeSite"
            >
              <img
                src="/static/img/nzf-logo-small.svg"
                class="h-full"
                :style="[
                  getSingleDonationsTotal() > 0 ||
                  getRegularDonationsTotal() > 0
                    ? { width: '200px', 'margin-left': '-10px' }
                    : {},
                ]"
              />
            </div>
          </div>

          <line-nav
            class="md:w-3/5 flex justify-center hidden sm:block"
          ></line-nav>

          <!-- <span class="block mt-4 flex flex-col lg:hidden summary">One-off</span> -->

          <!-- #START# Add Totals on top bar in mobile view -->
          <div
            class="w-full text-sm summary lg:hidden justify-center"
            v-if="getSingleDonationsTotal() > 0"
            :style="[
              getSingleDonationsTotal() > 0 && getRegularDonationsTotal() <= 0
                ? { 'margin-left': '4rem' }
                : { 'margin-left': '1rem' },
            ]"
          >
            <span style="color: #1d9868">One-off</span><br />
            <span class="bold-dark"
              >£{{ parseFloat(getSingleDonationsTotal()).toFixed(2) }}</span
            >
          </div>
          <div
            class="w-full text-sm summary lg:hidden justify-center"
            v-if="getRegularDonationsTotal() > 0"
            :style="[
              getSingleDonationsTotal() <= 0 && getRegularDonationsTotal() > 0
                ? { 'margin-left': '4rem' }
                : { 'margin-left': '1rem' },
            ]"
          >
            <span style="color: #1d9868">Monthly</span><br />
            <span class="bold-dark"
              >£{{ parseFloat(getRegularDonationsTotal()).toFixed(2) }}</span
            >
          </div>
          <!-- #END# Add Totals on top bar in mobile view -->

          <div class="ml-6 md:w-1/5 flex justify-end">
            <div class="cart-icon-container">
              <div
                class="
                  rounded-full
                  border border-blue-100
                  w-8
                  h-8
                  md:w-10 md:h-10
                  mr-2
                  relative
                  flex
                  justify-center
                  items-center
                  cursor-pointer
                "
                @click="toggleNav"
              >
                <span
                  class="ion-ios-cart text-lg flex text-blue-100"
                  v-if="calculatorProgress !== 0"
                ></span>
                <span
                  class="text-lg flex text-blue-100"
                  v-if="calculatorProgress == 0"
                  ><img src="/static/img/nzf-calculate.svg" class="w-4 h-4"
                /></span>

                <transition name="fade">
                  <div
                    v-if="
                      getSingleDonationsTotal() > 0 ||
                      getRegularDonationsTotal()
                    "
                    class="
                      absolute
                      top-0
                      w-3
                      right-0
                      border-white border
                      rounded-full
                      lg:hidden
                    "
                  >
                    <img src="/static/img/nzf-logo-small.svg" />
                  </div>
                </transition>
              </div>
            </div>
            <!-- :class="{'opacity-50': showNav, 'pointer-events-none': showNav}" -->
            <div
              class="
                rounded-full
                border border-red
                w-8
                h-8
                md:w-10 md:h-10
                flex
                justify-center
                items-center
                cursor-pointer
                transition-all
              "
              :class="{
                'opacity-50': transitions.isNavOpen,
                'pointer-events-none': transitions.isNavOpen,
              }"
              @click="moveOneStepBack"
            >
              <span
                class="ion-ios-close text-3xl sm:text-4xl flex text-red-100"
              ></span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white z-20">
        <div>
          <transition name="fade" mode="out-in">
            <!--<progress-calculator class="p-4 md:hidden "-->
            <!--key="1"-->
            <!--v-if="this.$route.path == '/calculator' && calculatorProgress > 0"-->
            <!--:width="progress">-->
            <!--</progress-calculator>-->

            <div class="w-full" key="0">
              <!--<back-btn>Back</back-btn>-->

              <div class="hide-scrollbar sm:-p-4 sm:hidden">
                <div class="line-nav-mob-container" id="line-nav-mob-container">
                  <line-nav class="mobile-line-nav" id="-mob"></line-nav>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <transition name="slide">
      <!-- <div v-if="showNav" class="fixed bg-purple-100 right-0 mobile-nav"> -->
      <div
        v-if="transitions.isNavOpen"
        class="fixed bg-purple-100 right-0 mobile-nav"
      >
        <div class="w-full flex justify-end p-4">
          <!-- v-if="fastMethod" -->
          <div
            v-if="fastMethod"
            class="w-full sm:w-1/2 sx:mb-10 xs:mb10 mb-40 px-4"
          >
            <btn id="complete-payment" class="-active" @click="toggleButtonNav">
              <span id="complete-payment-text">{{ getLabel("Pay Now") }}</span>
            </btn>
          </div>
          <div
            class="
              rounded-full
              border border-red
              md:w-10 md:h-10
              flex
              justify-center
              items-center
              cursor-pointer
              transition-all
            "
            :class="fastMethod ? 'w-12 h-10' : 'w-8 h-8'"
            @click="toggleNav"
          >
            <span
              class="ion-ios-close text-3xl sm:text-4xl flex text-red-100"
            ></span>
          </div>
        </div>

        <donation-side-bar-container
          v-if="this.$route.path !== '/thank-you'"
          class="p-2"
        ></donation-side-bar-container>

        <thank-you-side-bar-container
          v-else
          class="p-2"
        ></thank-you-side-bar-container>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
// import ProgressCalculator from './ProgressCalculator';
import LineNav from "./LineNav";
import DonationSideBarContainer from "./containers/DonationSideBarContainer";
import ThankYouSideBarContainer from "./containers/ThankYouSideBarContainer";
// import BackBtn from './inputs/BackBtn';
import { paths, paymentTypes } from "../utils/GlobalVars";
import { EventBus } from "../utils/eventBus";
import scrollDetector from "scroll-detector";
import queryString from "query-string";
import Btn from "./inputs/Btn";

export default {
  name: "NavBar",
  components: {
    DonationSideBarContainer,
    ThankYouSideBarContainer,
    LineNav,
    Btn,
  },
  data() {
    return {
      // showNav: false,
      fastMethod: false,
      scrollDirection: "up",
    };
  },
  methods: {
    toggleNav() {
      // this.showNav = !this.showNav;
      this.transitions.isNavOpen = !this.transitions.isNavOpen; //this.showNav;

      // if(this.showNav){
      if (this.transitions.isNavOpen) {
        document.body.classList.add("nav-open");
      } else {
        document.body.classList.remove("nav-open");
      }
    },
    toggleButtonNav() {
      this.transitions.isNavOpen = !this.transitions.isNavOpen; //this.showNav;

      // if(this.showNav){
      if (this.transitions.isNavOpen) {
        document.body.classList.add("nav-open");
      } else {
        document.body.classList.remove("nav-open");
      }
      if (this.calculatorProgress !== 3) {
        this.$store.dispatch("setProgressBar", {
          step: this.calculatorProgress,
        });
        this.$router.push({ path: "payment" });
      }
    },
    openMobileNav() {
      // this.showNav = true;

      this.transitions.isNavOpen = true;
      document.body.classList.add("nav-open");
    },
    scrollDown() {
      this.scrollDirection = "down";
    },
    scrollUp() {
      this.scrollDirection = "up";
    },
    closeSite() {
      localStorage.removeItem("journyData");
      window.location = "https://www.nzf.org.uk";
    },
    moveOneStepBack() {
      localStorage.removeItem("journyData");
      window.history.back();
    },
  },
  computed: {
    ...mapState({
      mode: (state) => state.mode,
      calculatorProgress: (state) => state.calculatorProgress,
    }),
    ...mapFields([
      "transitions",
      "donation.donationTypes",
      "calculatorFilter.hideWelcome",
      "donation.allocation",
    ]),
    ...mapGetters([
      "getRegularDonationsTotal",
      "getSingleDonationsTotal",
      "getLabel",
    ]),
    routes() {
      return [
        paths.calculator,
        paths.donation,
        paths.support,
        paths.payment,
        paths.thankYou,
      ];
    },
    computedRoutes() {
      if (this.mode !== "give") {
        return [
          {
            path: this.routes[0],
            text: this.getLabel("Calculator"),
          },
          {
            path: this.routes[1],
            text: this.getLabel("Give Zakat"),
          },
          {
            path: this.routes[2],
            text: this.getLabel("Support NZF"),
          },
          {
            path: this.routes[3],
            text: this.getLabel("Payment"),
          },
        ];
      } else {
        return [
          {
            path: this.routes[1],
            text: this.getLabel("Give Zakat"),
          },
          {
            path: this.routes[2],
            text: this.getLabel("Support NZF"),
          },
          {
            path: this.routes[3],
            text: this.getLabel("Payment"),
          },
        ];
      }
    },
  },
  mounted() {
    scrollDetector.on("scroll:down", this.scrollDown);
    scrollDetector.on("scroll:up", this.scrollUp);
    scrollDetector.on("at:top", this.scrollUp);
    // by adil
    let fast = "fast" in queryString.parse(location.search);
    if (fast) {
      if (screen.width <= 1200) {
        this.fastMethod = true;
        this.transitions.isNavOpen = true;

        if (this.transitions.isNavOpen) {
          document.body.classList.add("nav-open");
        } else {
          document.body.classList.remove("nav-open");
        }
      } else {
        document.body.classList.remove("nav-open");
        this.transitions.isNavOpen = false;
      }
    }
  },
  destroyed() {
    scrollDetector.off("scroll:down", this.scrollDown);
    scrollDetector.off("scroll:up", this.scrollUp);
    scrollDetector.off("at:top", this.scrollUp);
    EventBus.$off("openMobileNav", this.openMobileNav);
  },
  watch: {
    $route(to, from) {
      this.transitions.to = to.path;
      this.transitions.from = from.path;
      EventBus.$on("openMobileNav", this.openMobileNav);

      // this.setTab(this.routes.indexOf(to.path))
      if (from.meta.scrollTo) {
        this.transitions.scrollTo = from.meta.scrollTo;

        if (from.meta.scrollTo == "filter-section") {
          this.hideWelcome = true;
        }
      } else {
        this.transitions.scrollTo = "";
      }

      if (from.name === "calculator") {
        EventBus.$emit("resetSelect", {
          name: "zakat-item",
          val: paymentTypes.single,
        });

        this.donationTypes.find((el) => el.id == 0).paymentType =
          paymentTypes.single;
      }
    },
  },
};
</script>

<style scoped lang="scss">
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .summary {
    display: none;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .summary {
    display: none;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .summary {
    display: none;
  }
}
</style>
