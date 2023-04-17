<template>
    <modal name="my-first-modal" 
    height="auto"
    
    :resizable="true"
    class="pt-4"
    >
    
         <div  class="p-4 " v-if="!success">
            <h1 class="header-2 header mb-4" style="font-size: 20px">
                            
                            <div style="float: left; width:80%">
                                <h3 class="mb-2 md:mb-4 header-2 header"> {{ getLabel('Save My Calculation') }}</h3>
                                </div>
                                <div class="pt-4 w-quater flex justify-end">
                                    <div class="rounded-full border border-red 
                                                w-3 h-3 md:w-5 md:h-5 flex justify-center
                                                items-center cursor-pointer transition-all"
                                        @click="hide">

                                        <span class="ion-ios-close text-1xl sm:text-2xl flex text-red-100" ></span>
                                    </div>
                                </div>
                    </h1>
                <hr/>
                <p class="mb-3 md:mb-6 text-sm">To save your calculation, enter your email address and we'll send you a summary of your calculation so far and a link so you can continue where you left off.</p>
            <div class="flex flex-col sm:flex-row">
                <div class="w-full sm:w-1/2 sm:mr-4">
                    <text-input
                            placeholder="First Name"
                            :currency="false"
                            v-model="firstName"
                            :validators="{required: v.required}"
                            @errors="setValidate"
                            :small="true">
                    </text-input>
                </div>

                <div class="w-full sm:w-1/2 sm:ml-4">
                    <text-input
                            placeholder="Last Name"
                            :currency="false"
                            v-model="lastName"
                            :validators="{required: v.required}"
                            @errors="setValidate"
                            :small="true">
                    </text-input>
                </div>
            </div>
             <div class="flex flex-col sm:flex-row">
                <div class="w-full  ">
                    <text-input
                            placeholder="Email address"
                            :currency="false"
                            v-model="emailAddress"
                            :validators="{ required: v.required, email: v.email }"
                            @errors="setValidate"
                            :small="true">
                    </text-input>
                </div>
             </div>

             <div class="w-full">
                <checkbox 
                      @update="optInCheckbox"
                      :fullWidth="true"
                      :small="true"
                      :checkboxes="[
                         {name:'By using this calculation save feature, I agree to receive follow-up communication by email about the services provided by National Zakat Foundation. I understand that I will be able to unsubscribe from these emails at any time.', value: 1, selected: keepUpToDate}
                     ]">
                </checkbox>
            </div>
             <div class="w-full" style="padding-top: 30px" >
                  <span  v-if="success" class="text-lg" style="color: #1d9868">{{ getLabel('Email sent successfully!') }}</span>
                  <span  v-if="error" class="text-lg" style="color: #db3c42">{{ errorMsg }}</span>
            </div>
             <div class="w-full">
                <btn id="send-calculation-email" 
                :class="{'-active': true}" 
                @click="submitCalculation"
                >
                    <span  v-if="!loading" id="send-email-text">{{ getLabel('Send') }}</span>
                    <spinner v-else></spinner>
                </btn>
            </div>
         </div>
          <div  class="p-4" v-if="success">
                  <h1 class="header-2 header mb-4" style="font-size: 20px">
                                
                                <div style="float: left; width:80%">
                                    <h3 class="mb-2 md:mb-4 header-2 header"> {{ getLabel('Save My Calculation') }}</h3>
                                    </div>
                                    <div class="pt-4 w-quater flex justify-end">
                                        <div class="rounded-full border border-red 
                                                    w-3 h-3 md:w-5 md:h-5 flex justify-center
                                                    items-center cursor-pointer transition-all"
                                            @click="hide">

                                            <span class="ion-ios-close text-1xl sm:text-2xl flex text-red-100" ></span>
                                        </div>
                                    </div>
                        </h1>
                    <hr/>
                    <p class="mb-3 md:mb-6 text-md">Your calculation is on its way to your inbox! Please check your junk folder if you don't receive your email within an hour.</p>
                    <div class="w-full ">
                    <btn id="close-send-calculation-email" 
                    :class="{'-active': true}" 
                    @click="hide"
                    >
                        <span  id="close-send-email-text">{{ getLabel('Close') }}</span>
                    </btn>
                </div>
          </div>
    </modal>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { mapFields } from 'vuex-map-fields';
import TextInput from './inputs/TextInput';
import Btn from './inputs/Btn';
import Spinner from './Spinner';
import Checkbox from './inputs/Checkbox';
import validators from '../utils/validators';
import { EventBus } from '../utils/eventBus.js';
import { zakatableAssets, totalLiabilities, numberWithCommas, roundToTwo, zakatCalc } from './../utils/helpers';

export default {
    name: 'ModalComponent',
    components: { TextInput, Btn, Checkbox, Spinner },
    data(){
        return {
            firstName: "",
            lastName: "",
            emailAddress: "",
            keepUpToDate: false,
            validates: false,
            success: false,
            error: false,
            errorsArr: [],
            errorMsg: ""
        }
    },
    methods: {
        zakatableAssets(){
            return '£' + numberWithCommas(zakatableAssets()).toLocaleString();
        },
        totalLiabilities() {
            return '£' + numberWithCommas(totalLiabilities());
        },
        netAssets(){
            return '£' + numberWithCommas(roundToTwo(zakatableAssets() - totalLiabilities()))
        },
        formatZakat(){
            return '£' + numberWithCommas(zakatCalc());
        },
        show () {
            this.firstName = ""
            this.lastName = ""
            this.emailAddress = ""
            this.keepUpToDate = false
            this.loading = false
            this.$modal.show('my-first-modal');

            // Force dismiss specific toast
            // instance.dismiss();
            // Dismiss all opened toast immediately
            // this.$toast.clear();
        },
        hide () {
            this.firstName = ""
            this.lastName = ""
            this.emailAddress = ""
            this.keepUpToDate = false
            this.loading = false
            this.validates = false;
            this.success = false;
            this.error = false;
            this.errorsArr = [];
            this.$modal.hide('my-first-modal');
        },
        setValidate(payload) {

            if (!this.errorsArr.some((error) => error.id === payload.id)) {
                this.addError(payload);
            } else {
                this.updateError(payload);
            }

            (this.errorsArr.some(error => error.error)) ? this.validates = false : this.validates = true;
        },
        async emitCheckValidation () {
           await EventBus.$emit('checkValidation');
        },
        submitCalculation(){
            
            let summary = {
                WhatIHave: this.zakatableAssets(),
                WhatIOwe: this.totalLiabilities(),
                IsEqualTo: this.netAssets(),
                TodaysNisabIs: this.nisabValue,
                TotalZakat: this.formatZakat()
            }
            const regex = /[‘´ʼʹ’]/gi
            this.firstName = this.firstName.replace(regex, "'");
            this.lastName = this.lastName.replace(regex, "'");
            // let that = this
            let arr = this.errorsArr
            this.emitCheckValidation()
            
            setTimeout(() => {
                if(this.keepUpToDate){
                    
                    let resdata = JSON.parse(JSON.stringify(arr));
                    let checkError = resdata.filter(val => typeof val.error !== "undefined")
                    if(checkError.length <= 0){
                        this.loading = true
                        let payload = {
                            calculatorJourny: JSON.stringify({
                                assets: this.assets,
                                filter: this.filter,
                                settings: this.settings,
                                goldSilver: this.goldSilver,
                                pension: this.pension,
                                zakatCalculation: this.zakatCalculation,
                                summary: summary
                            }),
                            firstName: this.firstName,
                            lastName: this.lastName,
                            emailAddress: this.emailAddress,
                            keepUpToDate: this.keepUpToDate,
                            tag: "SaveCalculation",
                            _uetsid: localStorage.getItem("_uetsid"),
                            _uetsid_exp: localStorage.getItem("_uetsid_exp"),
                            _uetvid: localStorage.getItem("_uetvid"),
                            _uetvid_exp: localStorage.getItem("_uetvid_exp"),
                        }
                        // localStorage.setItem("calculation", JSON.stringify(cal))
                        this.$store.dispatch('sendCalculationJourny', payload).then(res=> {
                            
                            this.loading = false
                            this.success = true
                            this.error = false
                            this.errorMsg = ""
                            if( this.keepUpToDate ) {
                                this.keepUpToDate = false
                                document.getElementById("By using this calculation save feature, I agree to receive follow-up communication by email about the services provided by National Zakat Foundation. I understand that I will be able to unsubscribe from these emails at any time.0").click()
                            }
                            this.validates = false
                            this.errorsArr = []
                        }).catch(err=>{
                            this.loading = false
                            this.success = false
                            this.error = true
                            this.errorMsg = "Something went wrong please try again later!"
                        });
                    }
                } else {
                    this.error = true
                    this.errorMsg = "Consent required"
                    setTimeout(() => {
                        this.error = false
                        this.errorMsg = ""
                    }, 5000);
                }
            }, 5);
        },
        addError(error) {
            this.errorsArr.push(error);
        },
        updateError(updatedError) {
            this.errorsArr.forEach((error, index) => {
                if (error.id === updatedError.id) {
                    this.errorsArr[index] = updatedError
                }
                return error;
            });
        },
         optInCheckbox(val){
            this.keepUpToDate = val.includes(1);
            if(this.keepUpToDate){
                this.error = false
                this.errorMsg = ""
            }
        },
    },
    mounted(){
        EventBus.$on('openModal', this.show);
    },
    destroyed(){
        EventBus.$off('openModal', this.show);
    },
    computed: {
        nisabValue(){
            return '£' + this.getNissab().toFixed(2);
        },
        ...mapFields({
           assets: 'user.assets',
           filter: 'calculatorFilter.selected',
           settings:  'calculationSettings',
           goldSilver: 'goldSilverWeightSettings',
           pension: 'zakatCalculation.selectedPension',
           loading: 'paymentSubmit.loading',
        }),
        ...mapGetters([
            'getLabel',
            'getNissab',
            'getZakatCalc',
        ]),
        ...mapState({
            zakatCalculation: state => state.zakatCalculation,
            calculatorFilter: state => state.calculatorFilter
        }),
        v() {
            return {...validators}
        },
    }
}

</script>
<style scoped lang="scss">
.w-quater{
    width: 20%;
}
    .checkbox {
        user-select: none;
    }

    .checkbox-input {
        position: absolute;
        left: -999999px
    }

    .full-width {
        @include sm {
            /*width: 100% !important;*/
        }
    }
</style>