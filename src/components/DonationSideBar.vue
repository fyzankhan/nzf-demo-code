<template>
    <div  class="overflow-y-auto donation-sidebar  text-sm" v-if="!thankYou">
        <h3 class="text-xl mb-6 bold-dark">{{getLabel('My Donation Basket')}}</h3>
        <spinner v-if="loading"></spinner>
        <!--<transition name="fade">-->
            <div v-if="singleDonations.length > 0">
                <div class="bg-white shadow-lg rounded mb-4 overflow-hidden">
                    <div class="p-4 text-blue-200 uppercase text-xs font-semibold tracking-widest">
                       {{ getLabel('Single Payments') }}

                        <hr class="mt-4 pb-0 mb-0">
                    </div>
                    
                    <div v-for="(donation) in singleDonations" :key="donation.name+donation.id"
                         class="p-4 pt-0" :class="{'hidden':donation.amount <= 0}">
                            
                        <div v-if="donation.id == 0">
                            <zakat-sidebar :thankYou="thankYou"></zakat-sidebar>
                        </div>

                        <div v-else-if="donation.amount && donation.id !== 3">
                            <div class="flex justify-between w-full" >
                                <div class="flex flex-col">
                                    <span class="cursor-pointer text-blue-100 font-semibold" @click="setRouteTab(donation.name)">
                                     {{donation.name}}
                                    </span>

                                    <span class="text-sm text-blue-100 font-semibold" v-if="donation.name === donationNames.sad">
                                       (voluntary donation)
                                    </span>
                                    <span class="text-sm text-blue-100 font-semibold" v-if="donation.name === donationNames.rib">
                                       (interest)
                                    </span>
                                </div>

                                <div>
                                    <div>
                                        <span class="bold-dark ">
                                            {{format(donation.amount)}}
                                        </span>
                                    </div>

                                    <div @click.prevent="remove(donation.id)"
                                         class="remove-item"
                                         v-if="!thankYou && !isPaymentPage">
                                        Remove
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                    <hr>

                    <div class="p-4 pt-0 flex justify-between bold-dark">
                        <span>{{getLabel('Subtotal')}}</span> <span>{{format(localSingleDonationsTotal)}}</span>
                    </div>
                </div>
            </div>
        <!--</transition>-->

        <!--<transition name="fade">-->
            <div v-if="regularDonations.length > 0">
                <div class="bg-white shadow-lg rounded mb-4 overflow-hidden">
                    <div class="p-4 text-blue-200 uppercase text-xs font-semibold tracking-widest">
                        <!-- {{getLabel('Regular Payments')}} -->
                        <!-- {{getLabel('Every Month Payment')}} -->
                        {{getLabel('Regular Payment')}}

                        <hr class="mt-4 pb-0 mb-0">
                    </div>

                    <div v-for="(donation) in regularDonations" :key="donation.name+donation.id"
                         :class="{
                            'p-4':donation.amount > 0,
                            'pt-0':donation.amount > 0
                         }" >

                        <div v-if="donation.id == 0">
                            <zakat-sidebar type="regular" :thankYou="thankYou"></zakat-sidebar>
                        </div>

                        <div v-else-if="donation.amount && donation.id !== 3">
                            <div class="flex justify-between w-full">
                                <div class="flex flex-col">
                                    <span class="text-blue-100 font-semibold cursor-pointer" @click="setRouteTab(donation.name)">
                                       {{donation.name}}
                                    </span>

                                    <span class="text-sm text-blue-100 font-semibold" v-if="donation.name === donationNames.sad">
                                        (voluntary donation)
                                    </span>
                                    <span class="text-sm text-blue-100 font-semibold" v-if="donation.name === donationNames.rib">
                                        (interest)
                                    </span>
                                </div>

                                <div class="flex flex-col">
                                    <span class="bold-dark">{{format(donation.amount)}}</span>

                                    <div @click="remove(donation.id)"
                                         class="remove-item"
                                         v-if="!thankYou && !isPaymentPage">
                                        Remove
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr>

                    <div class="p-4 pt-0 bold-dark flex justify-between">
                        <span>{{getLabel('Subtotal')}}</span> {{format(localRegularDonationsTotal)}}
                    </div>
                </div>
            </div>
        <!--</transition>-->


        <span v-if="thankYou">
            <div class="flex flex-col mb-4 shadow-lg p-4 rounded">
                <div class="text-blue-200 uppercase text-sm font-semibold tracking-widest">
                        {{getLabel('Your Details')}}

                    <hr class="mt-4 ">
                </div>

                <span v-if="localAddress.address">{{ localAddress.address.lineOne }}</span>
                <span v-if="localAddress.address">{{ localAddress.address.lineTwo }}</span>
                <span v-if="localAddress.address">{{ localAddress.address.lineThree }}</span>
                <span v-if="localAddress.address">{{ localAddress.address.townCity }}</span>

                <div class="mb-4 flex flex-col">
                    <span>{{ localAddress.postCode }}</span>
                    <span class="mr-1">{{ address.countyRegion }}</span>
                </div>

                <!--<span class="mb-8">-->
                    <!--United Kingdom-->
                <!--</span>-->

                 <div class="flex flex-col mb-4">
                    <span class="break-all" v-if="localAddress.address">
                        {{ localAddress.address.emailAddress }}
                    </span>
                    <span class="break-all" v-if="localAddress.address">{{ localAddress.address.contactNumber }}</span>
                </div>
            </div>

            <div class="mb-4 p-4 shadow-lg rounded">
                
                <div class="text-blue-200 uppercase text-sm font-semibold tracking-widest">
                     {{getLabel('Payment Methods')}}

                    <hr class="mt-4 ">
                </div>

                <div class="flex flex-col">
                    <div class="mb-4" v-if="singleDonations.length > 0 && hiddenCardNumber">
                        <div class="bold-dark">
                            <span>{{getLabel('Single Payments')}}</span>
                        </div>

                        <div>
                            {{paymentTypeDescription}} - {{hiddenCardNumber}}
                        </div>
                    </div>


                    <div v-if="regularDonations.length > 0 && hiddenAccountNumber">
                        <div class="bold-dark">
                            <span>{{getLabel('Regular Payments')}}</span>
                        </div>

                        <div class="flex items-center">
                            <span class="text-xl mr-1">&#183; &#183; &#183; &#183;</span>{{hiddenAccountNumber}}
                        </div>
                    </div>
                </div>
            </div>
        </span>

        <div class="mb-4">
            
            <div v-if="localSingleDonationsTotal > 0">
                <div class="flex justify-between text-xl bold-dark">
                    <span>{{getLabel('Total')}}</span>
                    <span>{{format(localSingleDonationsTotal)}}</span>
                </div>

                <transition name="fade">
                    <div class="text-right text-md text-gray-300 leading-none  font-semibold" v-if="localRegularDonationsTotal > 0">
                        + {{format(localRegularDonationsTotal)}} a
                        <span v-if="paymentDetails.paymentDuration === 'monthly' ">
                            month
                        </span> 
                        <span v-else>
                            week
                        </span>
                    </div>
                </transition>
            </div>
            <div v-else-if="localRegularDonationsTotal > 0">
                <div class="flex flex-col justify-between text-xl bold-dark">
                    <div class="flex justify-between text-xl bold-dark">
                        <span>{{getLabel('Total')}}</span>

                        <div>
                            <span>{{format(localRegularDonationsTotal)}}</span>

                            <span class="text-right text-sm leading-none font-semibold" >
                                a <span v-if="paymentDetails.paymentDuration === 'monthly' ">
                            month
                        </span> 
                        <span v-else>
                            week
                        </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <p class="mt-2 mb-2"></p>
            <div v-if="(singleDonations.length > 0 || regularDonations.length > 0) && calculatorProgress !== 0">
                <gift-aid-sidebar></gift-aid-sidebar>
            </div>
            <div v-if="calculatorProgress == 0">
                <calculation-basket></calculation-basket>
            </div>
            <transition name="fade">
                 <!--Change text-sm to text-md -->
                <div v-if="localGiftAid" class="text-sm mt-6">
                    {{getLabel('An extra 25% will be added to your donation total through Gift Aid at no expense to you')}}
                </div>
            </transition>
        </div>
            
        <hr class="mb-4">

        <div  class="text-sm">

            <div class="mb-4">
                <router-link :to="paths.otherWays" class="text-blue-100 font-semibold">
                    {{getLabel('Or Explore other ways to pay')}}
                </router-link>
            </div>
            
        </div>
        
        <hr>

        <div>
            <!--Change text-xs to text-sm -->
            <p  class="text-xs">
                We make sure Muslims in need receive your Zakat within a lunar year. Rarely, there may not be enough need in your chosen fund in that year. If so, we’ll transfer your Zakat to the fund where the need is greatest.<br /><br />
                Still have questions? Email us on
                <!-- <a href="mailto:giversupport@nzf.org.uk" class="text-blue-100">giversupport@nzf.org.uk</a> -->
                <a class="text-blue-100" href="https://nzf.org.uk/about-nzf/get-in-touch/?utm_campaign=give-consent&utm_medium=payment&utm_source=giveapp&utm_content=application">Get in touch</a>
                and we’d be happy to help with any questions you have.
            </p>
        </div>
        

    </div>
    
</template>

<script>
    import { mapGetters, mapState } from 'vuex';
    import { currencyFormat } from '../utils/helpers';
    import { EventBus } from '../utils/eventBus';
    import {paymentTypes, donationNames, paths, deliveryFeeText} from '../utils/GlobalVars';
    import { mapFields } from 'vuex-map-fields';
    import ZakatSidebar from './ZakatSidebar';
    import GiftAidSidebar from './GiftAidSidebar';
    import Spinner from './Spinner';
    import CalculationBasket from "./CalculationBasket";
    const BigNumber = require('bignumber.js');

    export default {
        name: "DonationSidebar",
        components: { ZakatSidebar, GiftAidSidebar, Spinner, CalculationBasket },
        props: ['thank-you'],
        data(){
            return {
                loading: false,
                localDonationTypes: [],
                localAddress: {},
                localAccountNumber: {},
                localCardNumber: {}
            }
        },
        methods: {
            setRouteTab(step){
                if(!this.thankYou){
                    this.isNavOpen = false;
                    document.body.classList.remove('nav-open');
                    let activeStep = 0;
                    if(step == "Zakat ul Fitr"){
                        activeStep = 1
                    } else if(step == "Fidyah/Kaffarah"){
                        activeStep = 1
                    } else if(step == "Sadaqah (voluntary donation)"){
                        activeStep = 2
                    } else if(step == "Riba (interest)"){
                        activeStep = 2
                    }
                    if(activeStep == 1 && this.calculatorProgress !== 1){
                        this.$store.dispatch('setProgressBar',{
                            step: activeStep
                        });
                        this.$router.push({path: 'donation'});
                    } else if(activeStep == 2 && this.calculatorProgress !== 2){
                        this.$store.dispatch('setProgressBar',{
                            step: activeStep
                        });
                        this.$router.push({path: 'support'});
                    }
                }
            },
            format(num){
                return num ? currencyFormat(num) : '';
            },
            remove(id){
                if(!this.thankYou){
                    // this.$store.commit('REMOVE_BASKET_ITEM', {id})
                    this.$store.dispatch('deleteDonation', id);
                }
                EventBus.$emit('resetSelect', {
                    name: id,
                    val: paymentTypes.single
                });
            }
        },
        computed:{
            checkLoaded() {
                return document.readyState === "complete";
            },
            allocationText(){
                if(this.allocation == 'nzf'){
                    return 'Most needed';
                } else if(this.allocation == 'even'){
                    return 'Allocate evenly';
                }

                return false;
            },
            hiddenCardNumber(){
                let num = String(this.localCardNumber.cardNumber)
                return num.substring(num.length - 3)
            },
            hiddenAccountNumber(){
                // let num = String(this.accountNumber)
                // return num.substring(num.length - 3)

                return this.localAccountNumber.accountNumber
            },
            donationNames(){
                return donationNames;
            },
            paths(){
                return paths;
            },
            regularDonations(){
                if(!this.thankYou){
                    return this.getRegularDonations();
                } else{
                    return this.localDonationTypes.filter((el) => {
                        return el.paymentType == paymentTypes.regular && el.amount > 0;
                    });
                }

            },
            singleDonations(){
                if(!this.thankYou){
                    return this.getSingleDonations();
                } else if(this.localDonationTypes.length > 0){
                    return this.localDonationTypes.filter((el) => {
                        return el.paymentType == paymentTypes.single && el.amount > 0;
                    });
                } else {
                    return [];
                }

            },
            localRegularDonationsTotal(){
                if(!this.thankYou) {
                    return this.getRegularDonationsTotal();
                }

                let localRegularDonations = this.localDonationTypes.filter((el) => {
                    return el.paymentType == paymentTypes.regular && el.amount > 0;
                });

                if(localRegularDonations.length > 0){
                    return localRegularDonations.map((el, index) => {
                        if(el.id === 3) {
                            if(el.name === deliveryFeeText){
                                return el.amount;
                            } else {
                                return 0;
                            }
                        } else {
                            return el.amount;
                        }
                    }).reduce((acc, cur) => {
                        return (new BigNumber(acc)).plus(new BigNumber(cur))
                    });
                }

                return [];
            },
            localSingleDonationsTotal(){
                if(!this.thankYou) {
                    return this.getSingleDonationsTotal();
                }

                let localSingleDonations = this.localDonationTypes.filter((el) => {
                    return el.paymentType == paymentTypes.single && el.amount > 0;
                });

                if(localSingleDonations.length > 0){
                    return localSingleDonations.map((el, index) => {
                        if(el.id === 3) {
                            if(el.name === deliveryFeeText){
                                return el.amount;
                            } else {
                                return 0;
                            }
                        } else {
                            return el.amount;
                        }
                    }).reduce((acc, cur) => {
                        return (new BigNumber(acc)).plus(new BigNumber(cur))
                    });
                }

                return [];
            },
            localGiftAid(){
                if(localStorage.getItem('giftAid') && this.thankYou){
                   return JSON.parse(localStorage.getItem('giftAid')).giftAid;
                }

                return this.giftAid;
            },
            ...mapState({
                // donationTypes: state => state.donation.donationTypes,
                donationSplit: state => state.donation.donationSplit,
                allocation: state => state.donation.allocation,
                total: state => state.donation.totalChargeable,
                totalDonation: state => state.donation.totalDonation,
                giftAid: state => state.donation.giftAid,
                address: state => state.user.paymentDetails.address,
                postCode: state => state.user.paymentDetails.postCode,
                cardNumber: state => state.user.paymentDetails.cardNumber,
                accountNumber: state => state.user.paymentDetails.accountNumber,
                paymentTypeDescription: state => state.user.cardDetails.paymenttypedescription,
                cardDetails: state => state.user.cardDetails,
                calculatorProgress: state => state.calculatorProgress,
                SupportCostSlider: state => state.settings.SupportCostSlider
            }),
            ...mapGetters([
                'getSingleDonations',
                'getRegularDonations',
                'getTotalDonation',
                'getRegularDonationsTotal',
                'getSingleDonationsTotal',
                'getLabel'
            ]),
            ...mapFields([
                'user.paymentDetails',
                'transitions.isNavOpen',
                'donation.donationTypes',
                'user.assets',
                'user.reccommendZakat'
            ]),
            isPaymentPage(){
                return this.$route.name === 'payment';
            }
        },
        mounted(){
            if( screen.width <= 1200 && !this.checkLoaded) {
                this.loading = true;
                window.addEventListener('load', (event) => {
                    this.loading = false;
                })
            }
        },
        beforeMount(){
            if(localStorage.getItem('basket') && this.thankYou){
                this.localDonationTypes = JSON.parse(localStorage.getItem('basket'));
            }

            if(localStorage.getItem('address') && this.thankYou){
                this.localAddress = JSON.parse(localStorage.getItem('address'));
            }

            if(localStorage.getItem('accountNumber') && this.thankYou){
                this.localAccountNumber = JSON.parse(localStorage.getItem('accountNumber'));
            }

            if(localStorage.getItem('cardNumber') && this.thankYou){
                this.localCardNumber = JSON.parse(localStorage.getItem('cardNumber'));
            }

        }
    }
</script>
