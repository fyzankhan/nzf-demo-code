<template>
    <div class="flex flex-col-reverse sm:flex-row px-4 sm:px-0 m-auto mb-0 justify-center container layout" sticky-container>

        <div class="w-full sm:w-2/12 sm:mx-4 relative hidden md:block flex items-start left top-nav
                    transition-left transition-all">
            <sticky v-if="route">
                <div>
                    <slot name="left"></slot>
                </div>
            </sticky>
        </div>

        <div class="w-full sm:w-9/12 md:w-8/12 relative  bg-white
                    transition-center transition-all">
            <div class=" w-full">
                <slot name="center"></slot>
            </div>
        </div>

        <div class="w-full sm:w-3/12 md:w-2/12 sm:mx-4 top-nav transition-right transition-all">
            <sticky>
                <div>
                    <slot name="right"></slot>
                </div>
            </sticky>
        </div>
    </div>
</template>

<script>
    import Sticky from '../components/Sticky';

    export default {
        name: "Layout",
        components: {Sticky},
        data(){
            return {

            }
        },
        mounted() {
            if(this.PaymentMethod == 'Secure Trading'){
                let stScriptElement = document.createElement('script');
                stScriptElement.setAttribute('src', 'https://webservices.securetrading.net/js/v2/st.js');
                document.head.appendChild(stScriptElement);
            } else if(this.PaymentMethod == 'Stripe') {
                let stripeScriptElement = document.createElement('script');
                stripeScriptElement.setAttribute('src', 'https://js.stripe.com/v3/');
                document.head.appendChild(stripeScriptElement);
            }
            
            //  let givematchScriptElement = document.createElement('script');
            // givematchScriptElement.setAttribute('src', 'https://givematch.com/widget.js');
            // document.head.appendChild(givematchScriptElement);

            // let paypalScriptElement = document.createElement('script');
            // paypalScriptElement.setAttribute('src', 'https://www.paypalobjects.com/api/checkout.js');
            // document.head.appendChild(paypalScriptElement);

            
        //     let zakchatScriptElement = document.createElement('script');
        // zakchatScriptElement.setAttribute('src', 'https://zakchat.com/widget.js');
        // document.head.appendChild(zakchatScriptElement);
        },
        computed: {
            // ...mapState({
            // PaymentMethod: state => state.settings.PaymentMethod
            // }),
            route(){
                return this.$route.path !== '/calculator';
            }
         }
    }
</script>

<style scoped lang="scss">


</style>
