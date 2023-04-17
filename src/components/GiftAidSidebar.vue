<template>
<div class="bg-white shadow-lg rounded mb-4 overflow-y-auto">
                    <div class="p-4 text-blue-200 uppercase text-xs font-semibold tracking-widest">
                       Gift Aid it?

                        <hr class="mt-4 pb-0 mb-0">
                    </div>
                    <div class="p-4 pt-0">
                    <div class="text-sm">
                        <div class="flex justify-between h-13">
                            <div>
                                <div class=" text-sm "
                                    v-if="!thankYou">
                                    <div v-on:click="addGiftAid">
                                        <custom-radio-input 
                                        id="giftAidYes"
                                        :name="ukTaxPayer" 
                                        :giftAid="giftAid"
                                        :giftAidClicked="giftAidClicked"
                                        :giftAidAmount="giftAidAmount"
                                        value="1"
                                        />
                                    </div>
                                    <div style="margin-top:20px" v-on:click="removeGiftAid">
                                        <custom-radio-input 
                                        id="giftAidNo"
                                        :name="notUkTaxPayer"
                                        :giftAid="giftAid"
                                        :giftAidClicked="giftAidClicked"
                                        :giftAidAmount="giftAidAmount" 
                                        value="2"
                                        />
                                    </div>
                                    <br/>
                                </div>
                                <hr>
                                 <p class="mb-8 text-xs">
                                        {{getLabel('Gift Aid Paragraph Preview')}}
                                        <tool-tip :text="getLabel('Gift Aid Paragraph')" class="flex justify-start " :width="'50%'">
                                            <div class="text-blue-100 font-semibold cursor-pointer">
                                                    Read more
                                            </div>
                                        </tool-tip>
                                    </p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import { currencyFormat, zakatableAssets, totalLiabilities, roundToTwo, calcPercentOfNum } from './../utils/helpers';
    import ToolTip from './inputs/ToolTip';
    import CustomRadioInput from './inputs/CustomRadioInput';
    //import queryString from 'query-string';

    export default {
        name: "GiftAidSidebar",
        props: ['type', 'thankYou'],
        components: { CustomRadioInput, ToolTip },
        methods: {
            format(num){
                return currencyFormat(num);
            },
            currencyFormat(amount){
                return !amount ? '£0' : currencyFormat(amount);
            },
            removeGiftAid() {
                

                 this.$store.commit('SET_GIFT_AID',{
                        giftAidValue: 2,
                        giftAidClicked: true,
                        isTaxPayer: false,
                        amount: 0
                    })
                    this.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                            changeGiftAidOption: false
                        })
                        var that = this
                    setTimeout(function(){ 
                        that.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                            changeGiftAidOption: true
                        })
                     }, 0);
            },
            addGiftAid() {
                 this.$store.commit('SET_GIFT_AID',{
                        giftAidValue: 1,
                        giftAidClicked: true,
                        isTaxPayer: true,
                        amount: calcPercentOfNum(this.total(), 25)
                    })
                    this.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                            changeGiftAidOption: false
                        })
                        var that = this
                    setTimeout(function(){ 
                        that.$store.commit('SET_GIFT_AID_FROM_BASKET',{
                            changeGiftAidOption: true
                        })
                     }, 0);
            },
            netAssets(){
                return roundToTwo(zakatableAssets() - totalLiabilities())
            },
            total(){
                return parseFloat(this.getRegularDonationsTotal()) + parseFloat(this.getSingleDonationsTotal());
            },
            // giftAidValue(){
            //     return  roundToTwo(calcPercentOfNum(this.total(), 25)).toFixed(2);
            // },
        },
        computed: {
            ukTaxPayer(){
                return 'Yes, claim £' + roundToTwo(calcPercentOfNum(this.total(), 25)).toFixed(2) +  ' of Gift Aid';
                // return 'Yes, add Gift Aid';
            },
            notUkTaxPayer(){
                return 'No, do not claim Gift Aid';
            },
            ...mapGetters([
                'getRegularDonationsTotal',
                'getSingleDonationsTotal',
                'getLabel'
            ]),
            ...mapState({
                giftAid: state => state.donation.giftAid,
                giftAidClicked: state => state.donation.giftAidClicked,
                giftAidAmount: state => state.donation.giftAidAmount,
                giftAidValue: state => state.donation.giftAidValue,
                // donationTypes: state => state.donation.donationTypes,
            }),
            isPaymentPage(){
                return this.$route.name === 'payment';
            }
        },
        mounted(){
            /*if(typeof queryString.parse(location.search).giftaid !== "undefined"){
                if(queryString.parse(location.search).giftaid == "yes"){
                    this.addGiftAid()
                } else if(queryString.parse(location.search).giftaid == "no"){
                    this.removeGiftAid()
                }
            }*/
        }
    }
</script>

<style scoped>

</style>
