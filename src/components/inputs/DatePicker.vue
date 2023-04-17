<template>
  <div>
    <input
      type="date"
      class="focus:outline-none w-full input-container"
      data-date=""
      data-date-format="DD/MM/YYYY"
      :value="value"
      :min="min"
      id="regulardonationdateselectdate"
      @change="dateSelected"
    />
    <span v-if="show" style="color: red"
      >Payments cannot be charged on weekends</span
    >
  </div>
</template>

<script>
import moment from "moment";
import { mapFields } from "vuex-map-fields";
import validators from "../../utils/validators";
import $ from "jquery";

export default {
  name: "DatePicker",
  data() {
    return {
      min: new Date(), //"2022-01-17",
      value: "",
      show: false,
    };
  },
  mounted() {
    var result = new Date();
    result.setDate(result.getDate() + 10);
    let dayNo = result.getUTCDay();
    if (dayNo == 0) {
      result.setDate(result.getDate() + 1);
    }
    if (dayNo == 6) {
      result.setDate(result.getDate() + 2);
    }
    let date = moment(result, "DD/MM/YY").format("YYYY-MM-DD");
    this.min = date;
    this.value = date;
    this.paymentDetails.paymentStartDate = moment(result, "DD/MM/YY").format(
      "YY-MM-DD"
    );
    $("#regulardonationdateselectdate")
      .on("change", function () {
        let val = this.value ? this.value : date;
        let dayNo = new Date(val).getUTCDay();
        if (dayNo !== 0 && dayNo !== 6) {
          this.setAttribute(
            "data-date",
            moment(val, "YYYY-MM-DD").format(
              this.getAttribute("data-date-format")
            )
          );
        }
      })
      .trigger("change");
  },
  methods: {
    dateSelected(e) {
      let dayNo = new Date(e.target.value).getUTCDay();
      if (dayNo !== 0 && dayNo !== 6) {
        this.value = moment(new Date(e.target.value), "DD/MM/YY").format(
          "YYYY-MM-DD"
        );
        this.show = false;
        this.paymentDetails.paymentStartDate = moment(
          new Date(e.target.value),
          "DD/MM/YY"
        ).format("YY-MM-DD");
      } else {
        this.show = true;
        setTimeout(() => {
          this.show = false;
        }, 3000);
      }
    },
  },
  computed: {
    ...mapFields(["user.paymentDetails"]),
    v() {
      return { ...validators };
    },
  },
};
</script>

<style scoped>
input[type="date"] {
  position: relative;
  color: white;

  height: 42px;
  padding: 1rem;
  padding-top: 1rem;
  padding-bottom: 0.7rem;
  font-size: 20px !important;
}

input[type="date"]:before {
  position: absolute;
  top: 3px;
  font-weight: bold;
  content: attr(data-date);
  display: inline-block;
  color: black;
}

input[type="date"]::-webkit-datetime-edit,
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-clear-button {
  display: none;
}
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  left: -15px;
  opacity: 1;
  display: block;
  background: url(/static/img/calendarIcon.png) no-repeat;
  border-width: thin;
  bottom: 0;
  color: transparent;
  cursor: pointer;
  height: auto;
  right: 0;
  top: 0;
  width: auto;
}
.input-container input {
  border: none;
  box-sizing: border-box;
  outline: 0;
  padding: 0.75rem;
  position: relative;
  width: 100%;
}
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  input[type="date"]:before {
    left: 50px;
  }
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  input[type="date"]:before {
    left: 100px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  input[type="date"]:before {
    left: 100px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  input[type="date"]:before {
    left: 130px;
  }
}
</style>
