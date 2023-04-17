import * as vuelidatorMethods from 'vuelidate/lib/validators';

/*
* ADDITIONAL VALIDATOR METHODS
*/

export const postCodeCheck = (str) => {
    let regex = RegExp(/^[\w\d\s-]+$/);

    if(str.length > 8) {
        return false;
    }

    if(str.length == 0){
        return true;
    } else {
        return regex.test(str);
    }
};

export const userSelectedCheck = (isSelected) => {
    return isSelected;
};

export const amountCheck = (amount) => {
    // [0-9]|[,.]
    let amountRe = /^[0-9,.]+$/;
    let dotReg = /[.]{2,}/g;
    let val;

    if(typeof amount != 'number'){
        val = amount.replace(/,/g, '') > 0 ? parseFloat(amount.replace(/,/g, '')) : 0;
    } else {
        val = amount;
    }

    if(val >= 10000000){
        return false
    } else if(dotReg.test(amount)){
        return false;
    } else {
        return amount ? amountRe.test(amount) : true;
    }
};

export const numCheck = (num) => {
    // [0-9]|[,.]
    let amountRe = /^[0-9]+$/;
    return num ? amountRe.test(num) : true;
};

export const phoneNumberCheck = (num) => {
    //Checks for letter and selected special symbols  @,.?_=+&^%$£!:";'|~`\[]{}()}*
    let phoneRe = /[a-z]|[A-Z]|[@,.?_=&^%$£!:";'|~`\]\\[{{}}*]/;
    return !phoneRe.test(num);
};

export const lengthCheck = (str) => {

  return (str.trim()).length > 0;
};

export const accNameCheck = (str) => {

    // Allow alpha chars upper and lower, apostrophes, hyphens and white spaces in the string.
    // ^ + $ used to make sure the whole string matches and not just part
    let reg = /^[a-zA-Z-\s]+$/;

    return reg.test(str);
};


export default {
    ...vuelidatorMethods,
    postCodeCheck,
    userSelectedCheck,
    phoneNumberCheck,
    amountCheck,
    numCheck,
    lengthCheck,
    accNameCheck
}
