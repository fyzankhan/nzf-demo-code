<template>
  <div>
    <div class="flex flex-col sm:flex-row sx:flex-row">
      <div class="w-full sm:w-1/2 sx:w-1/2 sm:mr-4 mb-4 sm:mb-0">
        <text-input
          @keyup.enter.native="findAddress"
          id="postcodelockup"
          placeholder="Enter your postcode"
          @input="setPostCode"
          v-model="$v.text.$model"
          name="Postcode look-up"
          :currency="false"
          :small="true"
        ></text-input>

        <div
          class="error-container donation-item-error text-red-100"
          v-if="$v.text.$error"
        >
          <div>
            {{ getLabel("Please enter a valid post code") }}
          </div>
        </div>
      </div>

      <div
        class="
          w-full
          sm:w-1/2
          sx:w-1/2
          sm:ml-4
          sx:ml-4
          mb-4
          sm:mb-0 sm:mt-6
          sx:mt-6
        "
      >
        <btn class="text-green -active" @click="findAddress" :small="true">
          <div v-if="loading == false">Find Address</div>
          <spinner v-if="loading"></spinner>
        </btn>
      </div>
    </div>

    <div class="mb-8">
      <div
        class="
          sm:float-left
          sx:float-right
          text-blue-100 text-base
          font-semibold
          cursor-pointer
        "
        @click="openAddress"
      >
        {{ getLabel("Enter address manually") }}
      </div>
    </div>

    <transition name="fade">
      <div class="flex mb-20 relative z-50" v-if="addresses.length">
        <div class="w-full">
          <select-input
            @click="setAddress"
            :options="formatAddresses"
            :small="true"
            name="postcode"
          ></select-input>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-show="selectedAddress.postCode.length || enterManual">
        <div class="flex flex-col sm:flex-row sx:flex-row">
          <div class="w-full sm:w-1/2 sm:mr-4 mb-2 sm:mb-0">
            <text-input
              class=""
              v-model="paymentDetails.address.lineOne"
              id="addresslineone"
              name="Address Line 1*"
              placeholder="Enter address line 1"
              :currency="false"
              :small="true"
              :validators="{ required: v.required }"
              errormessage="Required"
              @errors="emitError"
            >
            </text-input>
          </div>

          <div class="w-full sm:w-1/2 sm:ml-4 mb-2 sm:mb-0 sm:ml-4 sx:ml-4">
            <text-input
              v-model="paymentDetails.address.lineTwo"
              id="addresslinetwo"
              name="Address Line 2"
              placeholder="Enter address line 2"
              :currency="false"
              :small="true"
            >
            </text-input>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sx:flex-row">
          <div class="w-full sm:w-1/2 sm:mr-4 mb-2 sm:mb-0">
            <text-input
              v-model="paymentDetails.address.townCity"
              name="City*"
              id="city"
              placeholder="Enter town/city"
              :currency="false"
              :small="true"
              :validators="{ required: v.required }"
              errormessage="Required"
              @errors="emitError"
            >
            </text-input>
          </div>

          <div class="w-full sm:w-1/2 sm:ml-4 mb-2 sm:mb-0 sm:ml-4 sx:ml-4">
            <div class="text-gray font-semibold sm:text-lg">Country</div>
            <select-input
              :small="true"
              id="country"
              :options="countryList"
              @click="selectCountry"
              class="z-10"
              name="country-select"
            >
            </select-input>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row">
          <div class="w-full sm:w-1/2 mb-2 sm:mb-0">
            <text-input
              v-model="paymentDetails.postCode"
              name="Postcode*"
              id="postcode"
              placeholder="Enter postcode"
              :currency="false"
              :small="true"
              :validators="{ required: v.required, maxLength: v.maxLength(8) }"
              errormessage="Please enter a valid post code"
              @errors="emitError"
            >
            </text-input>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import axios from "axios";
import SelectInput from "./inputs/SelectInput";
import TextInput from "./inputs/TextInput";
import Btn from "./inputs/Btn";
import Spinner from "./Spinner";
import { addressUrl, countryList } from "../utils/GlobalVars";
import { EventBus } from "../utils/eventBus";
import { postCodeCheck } from "../utils/validators";
import { mapFields } from "vuex-map-fields";
import { mapGetters, mapState } from "vuex";
import validators from "../utils/validators";
import { splitAtFirstSpace } from "../utils/helpers";
import queryString from "query-string";

export default {
  name: "AddressFinder",
  components: { SelectInput, TextInput, Btn, Spinner },
  data() {
    return {
      addresses: [],
      text: "",
      loading: false,
      errors: false,
      selectedAddress: {
        lineOne: "",
        lineTwo: "",
        townCity: "",
        postCode: "",
        countyRegion: "United Kingdom",
      },
      enterManual: false,
    };
  },
  props: {
    callback: {
      type: Function,
    },
  },
  validations: {
    text: {
      postCodeCheck,
    },
  },
  methods: {
    openAddress() {
      this.enterManual = true;
      this.$emit("open", this.enterManual);
    },
    findAddress(check) {
      if (
        this.paymentDetails.postCode !== "" &&
        this.paymentDetails.postCode !== null &&
        check == 0
      ) {
        this.enterManual = true;
        this.text = this.paymentDetails.postCode;
      } else if (encodeURIComponent(this.text) !== "") {
        this.loadAddresses();
      }
    },
    loadAddresses() {
      this.loading = true;
      let text = "";
      text = encodeURIComponent(this.text);
      if (text == "" || text == null) {
        text = queryString.parse(location.search).postcodelookup;
      }
      let API_URL =
        addressUrl +
        "Key=" +
        process.env.VUE_APP_FIND_ADDRESS_API_KEY +
        "&Countries=GB,US,CA&Limit=30&";

      EventBus.$emit("resetSelect", { name: "postcode", val: "Select" });

      axios.get(API_URL + "Text=" + text + "&").then((res) => {
        let items = res.data.Items;

        if (items[0].Error == "1001") {
          this.errors = true;
          this.loading = false;
        }

        if (items[0].Type == "Postcode" || items[0].Type == "Street") {
          let id = items[0].Id;

          axios
            .get(API_URL + "Text=" + text + "&" + "Container=" + id + "&")
            .then((res) => {
              this.addresses = res.data.Items;
              this.loading = false;
              this.errors = false;
            });
        } else if (items[0].Type == "Address") {
          this.addresses = res.data.Items;
          this.loading = false;
          this.errors = false;
        }
      });
    },
    setAddress(val) {
      let address = val.split(",");
      let concatinate = address[0].split(" ").length <= 5;

      address[0] = address[0].replace(",", "");

      address.reverse();

      if (address.length > 3) {
        if (concatinate) {
          this.selectedAddress = {
            lineOne: address[4] ? address[4] + address[3] : address[3],
            lineTwo: address[2],
            townCity: address[1],
            postCode: address[0].trim(),
            countyRegion: "United Kingdom",
          };
        } else {
          this.selectedAddress = {
            lineOne: address[4] ? address[4] + address[3] : address[3],
            lineTwo: address[2].trim(),
            townCity: address[1].trim(),
            postCode: address[0].trim(),
            countyRegion: "United Kingdom",
          };
        }
      } else {
        let newLine = splitAtFirstSpace(address[2]);

        if (concatinate) {
          this.selectedAddress = {
            lineOne: newLine[0] + " " + newLine[1],
            lineTwo: "",
            townCity: address[1].trim(),
            postCode: address[0].trim(),
            countyRegion: "United Kingdom",
          };
        } else {
          this.selectedAddress = {
            lineOne: newLine[0],
            lineTwo: newLine[1],
            townCity: address[1].trim(),
            postCode: address[0].trim(),
            countyRegion: "United Kingdom",
          };
        }
      }

      this.paymentDetails.postCode = address[0].trim();
      this.paymentDetails.address = {
        ...this.paymentDetails.address,
        ...this.selectedAddress,
      };
      if (this.callback) {
        this.callback();
      }
    },
    setPostCode(val) {
      this.paymentDetails.postCode = val;
    },
    emitError(payload) {
      this.enterManual = true;
      this.$emit("errors", payload);
    },
    selectCountry(val) {
      this.paymentDetails.address.countyRegion = val;
    },
  },
  computed: {
    formatAddresses() {
      return this.addresses.map((el) => {
        let newEl = el.Text + ", " + el.Description;

        return newEl;
      });
    },
    countryList() {
      return countryList;
    },
    ...mapState({
      postcodelookup: (state) => state.user.paymentDetails.postcodelookup,
      postCode: (state) => state.user.paymentDetails.postCode,
    }),
    ...mapFields(["user.paymentDetails"]),
    ...mapGetters(["getLabel"]),
    v() {
      return { ...validators };
    },
  },
  mounted() {
    let fast = "fast" in queryString.parse(location.search);
    let user = "user" in queryString.parse(location.search);
    if (fast || user) {
      let post = this.postcodelookup;
      post = post !== null && post !== "" ? post : false;

      if (post && (this.postCode == "" || this.postCode == null)) {
        this.text = post;
        this.findAddress(1);
      } else {
        this.findAddress(0);
      }
    } else {
      this.findAddress(0);
    }
    EventBus.$emit("resetSelect", {
      name: "country-select",
      val: "United Kingdom",
    });
  },
};
</script>

<style scoped lang="scss">
</style>
