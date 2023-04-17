import store from "../store.js";
import _ from "lodash";
import axios from "axios";
import tailwind from "../../tailwind.config";
const BigNumber = require("bignumber.js");
import { deliveryPercent } from "./GlobalVars";

export let removeChars = (num) => {
  let newNum = String(num).replace(/[^\d.-]/g, "");

  newNum = parseFloat(newNum) ? parseFloat(newNum) : 0;

  return newNum;
};

export const reducer = (accumulator, currentValue) => {
  let acc = parseFloat(accumulator) ? parseFloat(removeChars(accumulator)) : 0;
  let curr = parseFloat(currentValue)
    ? parseFloat(removeChars(currentValue))
    : 0;

  return acc + curr;
};

export let isXs = () => window.innerWidth < parseInt(tailwind.theme.screens.xs);

export let isSm = () => window.innerWidth < parseInt(tailwind.theme.screens.sm);

export let isMd = () => window.innerWidth < parseInt(tailwind.theme.screens.md);

export let reduceArrayObjects = (arr) => {
  let sum = _.sumBy(arr, (o) => {
    if (o.value) {
      return parseFloat(o.value) ? parseFloat(removeChars(o.value)) : 0;
    } else {
      return parseFloat(o.amount) ? parseFloat(removeChars(o.amount)) : 0;
    }
  });

  return sum;
};

export let roundNum = (num) => {
  num = parseFloat(num);

  return Math.round(num * 100) / 100;
};

export let numberWithCommas = (num) => {
  num = parseFloat(num);

  return num
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export let roundToThree = (num, upOrDown = 1) => {
  if (num) {
    if (typeof num !== "number") {
      num = parseFloat(num);
    }
    // num = parseFloat(num);
    // return num.toFixed(3);
    let n = new BigNumber(num);
    n.precision(3, BigNumber.ROUND_UP);
    let t = parseFloat(n.toFixed(3, upOrDown)).toFixed(3);
    return Math.round(t * 1e2) / 1e2;
  }
  return 0.0;
};

export let roundToTwo = (num, upOrDown = 1) => {
  if (num) {
    if (typeof num !== "number") {
      num = parseFloat(num);
    }
    let n = new BigNumber(num);
    n.precision(2, BigNumber.ROUND_UP);
    let t = parseFloat(n.toFixed(2, upOrDown)).toFixed(2);
    return Math.round(t * 1e2) / 1e2;
  }
  return 0.0;
};

export let roundToOne = (num) => {
  return Math.round(num * 10) / 10;
};

export let calcPercentOfNum = (num, percent, upOrDown = 1) => {
  if (num) {
    if (typeof num !== "number") {
      num = parseFloat(num);
    }
    return parseFloat((num / 100) * percent);
  }
  return 0.0;
};

export let currencyFormat = (num, currency) => {
  let newNum = num > 0 ? roundToTwo(num) : parseFloat(num);
  return "£" + numberWithCommas(newNum);
};

export let totalPension = () => {
  let assets = store.state.user.assets;

  //Get pension zakat %
  let selectedPension = store.state.zakatCalculation.selectedPension;

  let pensionPercent = store.state.zakatCalculation.pensions[selectedPension];
  selectedPension =
    typeof selectedPension !== "undefined" && selectedPension !== null
      ? selectedPension
      : [];

  if (selectedPension.length > 0) {
    pensionPercent = store.state.zakatCalculation.pensions[selectedPension];
  } else {
    pensionPercent = 1;
  }

  //Pension
  let pension = removeChars({ ...assets.cash }.pension);
  let pensionCalc = pension * pensionPercent;

  return parseFloat(pensionCalc) ? parseFloat(pensionCalc) : 0;
};

export let goldSilver = () => {
  let assets = store.state.user.assets;

  // Gold Sliver
  let gold = parseFloat(assets.gold) ? assets.gold : 0;
  let silver = parseFloat(assets.silver) ? assets.silver : 0;

  return parseFloat(gold) + parseFloat(silver);
};

export let totalBusinessAssets = () => {
  let assets = store.state.user.assets;

  // BusinessAssets
  let businessAssets = { ...assets.businessAssets };
  delete businessAssets.other;
  let otherAssets = { ...assets.businessAssets }.other;
  otherAssets = reduceArrayObjects(otherAssets);

  return Object.values(businessAssets).reduce(reducer) + otherAssets;
};

export let totalCryptoOtherAssets = () => {
  let assets = store.state.user.assets;

  let otherAssets = assets.crypto.other;
  otherAssets = reduceArrayObjects(otherAssets);

  return otherAssets;
};

export let totalGoldSilverOtherAssets = () => {
  let assets = store.state.user.assets;

  let otherAssets = assets.goldSilver.other;
  otherAssets = reduceArrayObjects(otherAssets);

  return otherAssets;
};

export let totalMoneyOwedOtherAssets = () => {
  let assets = store.state.user.assets;

  let otherAssets = assets.moneyOwed.other;
  otherAssets = reduceArrayObjects(otherAssets);

  return otherAssets;
};

export let totalInvestmentsOtherAssets = () => {
  let assets = store.state.user.assets;

  let otherAssets = assets.investment.other;
  otherAssets = reduceArrayObjects(otherAssets);

  return otherAssets;
};

export let totalCashAssets = () => {
  let assets = store.state.user.assets;
  //Cash
  let cash = { ...assets.cash };
  let otherCash = { ...assets.cash }.other;
  otherCash = reduceArrayObjects(otherCash);
  delete cash.other;
  delete cash.pension;
  delete cash.sharesInvestments;
  if (cash.sharesDividend != "") {
    /**
     * Calculate 25% of the shares dividend
     * @type {number}
     */
    cash.sharesDividend = calcPercentOfNum(cash.sharesDividend, 25);
  }
  // console.log(Object.values(cash).reduce(reducer), otherCash)
  //TOTALS
  return roundToTwo(Object.values(cash).reduce(reducer) + otherCash);
};

export let stocksSharesIsaCalc = () => {
  let assets = store.state.user.assets;

  let investment = { ...assets.cash }.sharesInvestments;

  return removeChars(investment) * 0.25;
};

export let zakatableAssets = () => {
  let assetTotal =
    roundToTwo(stocksSharesIsaCalc()) +
    roundToTwo(goldSilver()) +
    roundToTwo(totalCashAssets()) +
    roundToTwo(totalPension()) +
    roundToTwo(totalBusinessAssets()) +
    roundToTwo(totalCryptoOtherAssets()) +
    roundToTwo(totalInvestmentsOtherAssets()) +
    roundToTwo(totalGoldSilverOtherAssets()) +
    roundToTwo(totalMoneyOwedOtherAssets());

  // console.log(totalCashAssets(), totalPension())
  return roundToTwo(assetTotal);
};

export let totalLiabilities = () => {
  let assets = store.state.user.assets;

  // Liabilities
  let liabilities = { ...assets.liabilities };
  delete liabilities.other;

  let otherLiabilities = { ...assets.liabilities }.other;

  otherLiabilities = reduceArrayObjects(otherLiabilities);

  //TOTALS
  let totalLiabilities =
    otherLiabilities + Object.values(liabilities).reduce(reducer);

  return roundToTwo(totalLiabilities);
};

export let zakatCalc = () => {
  let assetTotal = zakatableAssets();
  let liabilitiesTotal = roundToTwo(totalLiabilities());

  let netAssets = assetTotal - liabilitiesTotal;

  let zakat = calcPercentOfNum(netAssets, 2.5);

  return netAssets >
    Math.min(
      store.state.nissab.nisab_gold_value,
      store.state.nissab.nisab_silver_value
    )
    ? zakat
    : 0;
};

export let allocateableZakat = () => {
  let assetTotal = zakatableAssets();
  let liabilitiesTotal = totalLiabilities();

  let netAssets = assetTotal - liabilitiesTotal;

  let zakat = calcPercentOfNum(netAssets, 2.5);

  let calc =
    netAssets >
    Math.min(
      store.state.nissab.nisab_gold_value,
      store.state.nissab.nisab_silver_value
    )
      ? zakat
      : 0;

  calc = new BigNumber(calc);
  let percent = new BigNumber(calcPercentOfNum(calc, deliveryPercent));

  return calc.minus(percent).toFixed();
};

// export let

export let splitAtFirstSpace = (str) => {
  if (!str) return [];
  var i = str.indexOf(" ");
  if (i > 0) {
    return [str.substring(0, i), str.substring(i + 1)];
  } else return [str];
};

export let stringToNum = (str) => {
  if (str && typeof str == "string") {
    return parseFloat(str.replace(/[^\d.-]/g, ""));
  } else if (str && typeof str == "number") {
    return str;
  } else {
    return "";
  }
};

export let submitDonationToApi = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_API_URL + "/gc-donation", payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export let submitDonationToStripeApi = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_API_URL + "/stripeDonation", payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export let submitDonationToStripePIApi = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_API_URL + "/getPaymentIntent", payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export let savePaypalTransaction = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_API_URL + "/savePaypalTransaction", payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export let submitDonationToCMS = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_API_URL + "/paymentConfirm", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export let submitSessionDataApi = (payload) => {
  return new Promise((resolve, reject) => {
    axios
      .post(process.env.VUE_APP_API_URL + "/session", payload)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export let bigNumberMult = (num1, num2) => {
  num1 = parseFloat(num1);
  num2 = parseFloat(num2);
  return roundToTwo(new BigNumber(num1).multipliedBy(new BigNumber(num2)));
};
