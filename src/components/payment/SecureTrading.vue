<template>
    <div>
        <div class="w-full">
            <form id="st-form" action="/st-payment" method="post" class="flex flex-wrap">
               <div class="w-full md:w-1/2 md:pr-2 payment-input">
                   <div id="st-card-number" class="st-card-number h-full w-full "></div>
               </div>

                <div class="w-1/2 md:w-1/4 pr-2 md:pl-2 payment-input">
                    <div id="st-expiration-date" class="st-expiration-date payment-input w-full"></div>
                </div>

                <div class="w-1/2 md:w-1/4 pl-2 payment-input mb-12">
                    <div id="st-security-code" class="st-security-code payment-input"></div>
                </div>

                <div class="w-1/2 payment-input hidden">
                    <div id="st-animated-card" class="st-animated-card-wrapper payment-input"></div>
                </div>

                <button type="submit" id="st-form__submit" class="st-form__submit -active w-1/2 hidden" ref="cardform">
                    Pay securely
                </button>
            </form>

            <div id="st-notification-frame" class="hidden"></div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import { EventBus } from '../../utils/eventBus.js';
    import { mapFields } from 'vuex-map-fields';
    import { mapGetters } from 'vuex';

    export default {
        name: "SecureTrading",
        data() {
            return {
                st: null,
                cardPaymentSuccess: false
            }
        },
        methods: {
            processPaymentResponse: _.debounce(function(data) {
                this.loading = true;
                // console.log('payment response callback!', data)


                localStorage.setItem('cardNumber', JSON.stringify(
                    {
                        cardNumber:  data.maskedpan
                    }
                ));

                this.cardPaymentSuccess = true;

                if(data.errorcode != 0) {// || data.errorcode != "50003"){

                    this.errorMsg('Error processing card details');

                } else if(data.errorcode == 0){

                    this.$store.dispatch('submitPayment', data).then((res) => {

                        this.loading = false;
                        this.msg = '';
                        this.$router.push({ path: '/thank-you' });

                    }).catch((res) =>{
                        this.errorMsg('Error processing payment details');
                    });
                }
            }, 2000),
            submit(){
                this.$refs.cardform.click();

                setTimeout(()=>{
                    if(!this.cardPaymentSuccess){
                        this.$scrollTo('#card-details', 500, {offset: -75})
                    }
                },15000);
            },
            errorMsg(msg){
                this.loading = false;
                this.errors = true;
                this.msg = msg;


                setTimeout(() => {
                    this.errors = false;
                    this.msg = '';
                }, 5000);
            }
        },
        computed: {
            jwt() {
                return this.$store.state.secureTrading.jwt;
            },
            ...mapFields([
                'paymentSubmit.loading',
                'paymentSubmit.errors',
                'paymentSubmit.msg'
            ]),
            ...mapGetters([
                'getSingleDonationsTotal'
            ])
        },
        mounted() {
            let singleTotal = this.getSingleDonationsTotal();

            this.$store.dispatch('getSecureTradingJwt', {
                amount: singleTotal //in pence
            }).then((res) => {
                // eslint-disable-next-line no-undef
                if (!_.isUndefined(SecureTrading)) {
                    let args = {
                        jwt: this.jwt,
                        animatedCard: true,
                        submitOnSuccess: false,
                        submitOnError: false,
                        submitCallback: this.processPaymentResponse,
                    };

                    if (process.env.VUE_APP_BRANCH == 'live') {
                        args['livestatus'] = 1;
                    }

                    // eslint-disable-next-line no-undef
                    this.st = SecureTrading(args);
                    this.st.Components();
                }
            });


            EventBus.$on('submitPayment', this.submit);
        },
        destroyed(){
            EventBus.$off('submitPayment', this.submit);
        }
    }
</script>

<style scoped>
.notification-frame--success{
    display:none !important;
    opacity: 0 !important;
    height: 0 !important;
}
</style>
