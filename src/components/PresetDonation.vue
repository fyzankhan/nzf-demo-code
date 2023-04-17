<template>
    <div class="flex flex-col sm:flex-row donation-preset mb-6">
        <!-- <div class="sm:pr-2 mb-4 sm:mb-0 sm:w-1/2 single-preset">
            <div class="bg-white">
                <h3 class="text-center text-blue-200">{{paymentTypeNames.single}}</h3>

                <div class="flex flex-wrap preset-btn-container flex-grow sm:justify-center">
                    <div v-for="amount in singleAmounts"
                         :class="{'-active': selectedSingle == amount}"
                         :key="amount"
                         @click="addDonation(amount, paymentTypeNames.single)"
                         class="text-center py-2  border border-gray-200 rounded preset-btn cursor-pointer">
                        <div class="-mb-1">
                            £{{amount}}
                        </div>
                    </div>
                </div>
            </div>
        </div> -->

        <hr class="sm:hidden preset-separate-bar">

        <div class="sm:pl-2 sm:w-full regular-preset">
            <div class="bg-white ">
                <!-- <h3 class="text-center text-blue-200">{{paymentTypeNames.regular}}</h3> -->

                <div class="flex flex-wrap preset-btn-container flex-grow sm:justify-center">
                    <div v-for="(amount, index) in regularAmounts"
                         :class="{'-active': selectedRegular == amount, 'setMargin': index }"
                         :key="amount"
                         @click="addDonation(amount, paymentTypeNames.regular)"
                         class="text-center py-2 border border-gray-200 rounded preset-btn cursor-pointer " >

                        <div class="-mb-1">
                            £{{amount}}
                        </div>

                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { paymentTypes } from "../utils/GlobalVars";
    // import { EventBus } from '../utils/eventBus';
    import { mapState } from 'vuex';
    import {  mapFields } from 'vuex-map-fields';
    import _ from 'lodash';

    export default {
        name: "PresetDonation",
        props: ['id', 'name'],
        data(){
            return {
                singleAmounts: [25, 50, 100],
                regularAmounts: [10, 25, 50],
                selectedSingle: '',
                selectedRegular: '',
            }
        },
        methods: {
            addDonation(amount, paymentType){
                paymentType = this.donationData.selectedPaymentType
                let donation = {
                    id: this.id,
                    amount: amount,
                    name: this.name,
                    paymentType: this.donationData.selectedPaymentType,
                    selectedPaymentType: this.donationData.selectedPaymentType
                    
                };

                if(paymentType == paymentTypes.single){
                    this.selectedRegular = '';
                    this.selectedSingle = amount;

                } else {
                    this.selectedSingle = '';
                    this.selectedRegular = amount;
                }

                this.setPreset(amount, paymentType, this.id);
                // EventBus.$emit('resetSelect', {name:this.id , val:paymentType})

                this.$store.dispatch('addDonation', donation);
            },
            // clearPresets(val){
            //     if(val == this.id){
            //         this.selectedSingle = '';
            //         this.selectedRegular = '';
            //         this.preset.id = '';
            //         this.preset.amount = '';
            //         this.preset.paymentType = '';
            //     }
            // },
            setPreset(amount, paymentType, id){
                this.preset.id = id;
                this.preset.amount = amount;
                this.preset.paymentType = paymentType;
            }
        },
        computed: {
            paymentTypeNames(){
                return paymentTypes;
            },
            ...mapFields([
                'preset'
            ]),
            ...mapState({
                donationData: state => state.donation
            }),
        },
        mounted(){
            // EventBus.$on('clearPresets', this.clearPresets);

            if(!_.isEmpty(this.preset)){
                if(this.preset.paymentType == paymentTypes.single){
                    this.selectedSingle = this.preset.amount;
                } else {
                    this.selectedRegular = this.preset.amount;
                }
            }
        },
        destroyed(){
            // EventBus.$off('clearPresets', this.clearPresets);
        }
    }
</script>

<style scoped>
/* @media (min-width: 750px) {
    .setMargin{
        margin-left: 0 !important;
    }
}
.setMargin{
    margin-left: 2rem;
} */
.preset-btn-container .preset-btn {
    width: 30%;
}
</style>
