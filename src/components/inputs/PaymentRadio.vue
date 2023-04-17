<template>
    <div class="flex justify-between w-full radio-component"
        :class="{
            'flex-col':fullWidth,
            'flex-wrap': wrap,
            '-no-wrap-container': !wrap
        }">

        <div v-for="(button, index) in buttons" :key="button + index"
             
            :id="assignGtagIds(button.name,2,index)"
             @click.prevent="update(button.value)"
             >
             <div class="input-container bg-white px-4 py-2 sm:p-4 radio-container flex justify-start align-center cursor-pointer mb-2 md:mb-6"
             :class="{
                 selected: button.value === selected,
                 'w-1/3': !fullWidth,
                 'small-radio': !fullWidth,
                 'w-full': fullWidth,
                 'full-width': fullWidth,
                 'small': !fullWidth,
                 '-no-wrap': !wrap
             }"
             >
<!--:id="uniqueId(index, button.name)"-->
                <input
                    type="radio"
                    :id="assignGtagIds(button.name,3,index)"
                    :name="button.name"
                    :value="button.value"
                    v-model="selected"
                    class="radio-input"
                    checked>

                <label :for="uniqueId(index, button.name)"
                    v-if="button.name"
                    class="mb-0 radio-label bold-dark "
                        :id="assignGtagIds(button.name,0,index)"
                        :class="{'small-label': !fullWidth}">

                    <div class="absolute checkmark-icon" v-if="button.value === selected" :id="assignGtagIds(button.name,0,index)">
                        <i class="text-green ion-ios-checkmark-circle radio-check-icon" :id="assignGtagIds(button.name,0,index)"></i>
                    </div>

                    <div class="radio-btn-text"
                    :class="{
                        'ml-4 ': fullWidth
                    }" :id="assignGtagIds(button.name,0,index)">
                        <span class="radio-text" style="float: left;" :id="assignGtagIds(button.name,0,index)">{{button.name}}</span>
                    </div>
                    <img v-if="button.value == 'paypal' && getGateway('paypal')" src="/static/img/paypal.svg" alt="" class="paypalImage" />
                    <div v-if="button.value == 'stripe' && PaymentMethod == 'Stripe'" class="stripeImage">
                        <img src="/static/img/icons8-visa.svg" alt="Visa" />
                        <img src="/static/img/icons8-mastercard.svg" alt="Master Card" />
                        <img src="/static/img/icons8-american-express.svg" alt="American Express" />
                        <img src="/static/img/icons8-maestro.svg" alt="Maestro" />
                    </div>
                    <div v-if="button.value == 'stripe' && PaymentMethod == 'Secure Trading'" class="secureTradingImage">
                        <img src="/static/img/icons8-visa.svg" alt="Visa" />
                        <img src="/static/img/icons8-mastercard.svg" alt="Master Card" />
                    </div>
                </label>
             </div>
                <transition name="fade">
                    <div class="w-full full-width" v-if="button.value == 'stripe' && PaymentMethod == 'Stripe' && button.value === selected">
                        <stripe-checkout ref="stripe"></stripe-checkout>
                    </div>
                </transition>
        </div>
         
    </div>
</template>

<script>
    import { EventBus } from '../../utils/eventBus';
    import { mapState } from 'vuex';
    import StripeCheckout from '../payment/Stripe';

    export default {
        name: "Radio",
        components: {
            StripeCheckout
        },
        model: {
            event: "change"
        },
        props: {
            buttons: {
                type: [Array, Object, String],
                required: true
            },
            fullWidth: {
                type: Boolean,
                default: false
            },
            required: {
                type: Boolean,
                default: true
            },
            default:{
                type: Number
            },
            id: {
                type: String
            },
            wrap: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                selected: null
            }
        },
        methods: {
            getGateway(val){
                let gate = this.gateways.filter(itm=>itm.alias == val)
                if(gate.length > 0){                    
                    return gate[0].active == 'Yes' ? true : false
                } else {
                    return false
                }
            },
            assignGtagIds(name,method,index) {
                return name.includes('10%') == true ? '10-percent-zakat': name.includes("100%") == true ? '100-percent-zakat' : name.includes('Yes') == true ? 'gift-aid-yes' : name.includes('No') == true ? 'gift-aid-no' : method == 1 ? this.uniqueId(index, name) : name.replace(/ /g,'')+method;
                
            },
            update(value) {

                if(this.selected == value && !this.required){
                    this.selected = null;
                    this.$emit('change', this.selected);
                } else {
                    this.selected = value;
                    this.$emit('change', this.selected);
                }
            },
            uniqueId(index, name){
                return index + name.replace(/ /g,'') + this._uid
            },
            setValue(payload){
                if(payload.id == this.id){
                    this.selected = payload.val;
                }
            }
        },
        computed: {
        ...mapState({
                gateways: state => state.gateways,
                PaymentMethod: state => state.settings.PaymentMethod
            }),
        },
        mounted() {
            this.buttons.map((el) => {
                if(el.selected){
                    this.selected = el.value;
                }

                if(this.default == el.value){
                    this.selected = el.value;
                }

            });


            if (this.selected) {
                this.$emit('init', this.selected);
            }

            EventBus.$on('setValue', this.setValue)
        },
        destroyed(){
            EventBus.$off('setValue', this.setValue)
        }
    }
</script>

<style scoped lang="scss">
    .checkmark-icon {
        left: 0px;
        top: -2px;
        font-size: 24px;
    }

    .radio-input {
        position: absolute;
        margin-right: -9999px
    }
    .stripeImage > img {
        float: left;
        
    }
    
    .secureTradingImage > img {
        float: left;
    }
    

    @media (max-width: 330px){
        .ml-4 {
            margin-left: 0;
            width: 62%;
        }
     }
    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
        .paypalImage {
            margin-left: 160px; 
            float: right; 
            width: 20%
        }
        .ml-4 {
            margin-left: 0;
            width: 55%;
        }
        .radio-container label {
            position: relative;
            padding-left: 35px;
            cursor: pointer;
            line-height: 26px;
            display: flex;
            width: calc(100% - 0px);
        }
        .stripeImage > img {
            max-width: 100%;
            height: 29px;
        }
        .mob-1 {
            padding-top: 0.9rem;
            padding-bottom: 2.5rem;
        }
        .stripeImage {
            margin-left: 7px; 
            margin-top: 0; 
            float: left
        }
        .secureTradingImage {
            margin-left: 0px; 
            margin-top: 0; 
            float: left
        }
        .secureTradingImage {
            margin-left: 0; 
            margin-top: 0; 
            float: left
        }
    }

    /* Small devices (portrait tablets and large phones, 600px and up) */
    @media only screen and (min-width: 600px) {
        .paypalImage {
            margin-left: 190px; 
            float: right; 
            width: 20%
        }
        .mob-1 {
            padding-top: 0.9rem;
            padding-bottom: 2.5rem;
        }
        .stripeImage {
            margin-left: 7px; 
            margin-top: 0; 
            float: left
        }
        .secureTradingImage {
            margin-left: 0; 
            margin-top: 0; 
            float: left
        }
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
        .paypalImage {
            margin-left: 190px; 
            float: right; 
            width: 20%
        }
        .mob-1 {
            padding-top: 0.9rem;
            padding-bottom: 2.5rem;
        }
        .stripeImage {
            // margin-left: 300px; 
            // margin-top: -35px; 
            float: right
        }
        .secureTradingImage {
            margin-left: 400px; 
            margin-top: -35px; 
            float: right
        }
        .radio-container label {
            width: calc(100% - 0px);
        }
    }

    /* Large devices (laptops/desktops, 992px and up) */
    @media only screen and (min-width: 992px) {
        .paypalImage {
            margin-left: 190px; 
            float: right; 
            width: 20%;
            position: unset;
            bottom: 0;
            left: 0;
        }
        .stripeImage {
            margin-left: 300px; 
            margin-top: -35px; 
            float: right
        }
        .secureTradingImage {
            margin-left: 300px; 
            margin-top: -35px; 
            float: right
        }
    }

    /* Extra large devices (large laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1200px) {
        .paypalImage {
            margin-left: 190px; 
            float: right; 
            width: 20%;
            position: unset;
            bottom: 0;
            left: 0;
        }
        .stripeImage {
            margin-left: 300px; 
            margin-top: -35px; 
            float: right
        }
        .secureTradingImage {
            margin-left: 400px; 
            margin-top: -35px; 
            float: right
        }
    }
</style>
