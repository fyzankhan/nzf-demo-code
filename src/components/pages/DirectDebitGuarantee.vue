<template>
    <scroll-container id="top">
        <div class="pt-32 pb-10 px-4 lg:px-0"  style="z-index: 30" >

            <h1 class="header-2 header mb-8">Direct Debit Guarantee</h1>


            <div class="mb-4">
               This Guarantee is offered by all banks and building societies that accept instructions to pay Direct Debits. If there are any changes to the amount, date or frequency of your Direct Debit, Eazy Collect Services Ltd (who administer direct debits on behalf of National Zakat Foundation) will notify you 10 working days in advance of your account being debited or as otherwise agreed.
            </div>

            <div class="mb-4">
                If you request Eazy Collect Services Ltd to collect a payment for the National Zakat Foundation, confirmation of the amount and date will be given to you at the time of the request. If an error is made in the payment of your Direct Debit by Eazy Collect Services Ltd or your bank or building society, you are entitled to a full and immediate refund of the amount paid from your bank or building society.
            </div>

            <div class="mb-4">
                If you receive a refund you are not entitled to, you must pay it back when Eazy Collect Services Ltd asks you to. You can cancel a Direct Debit at any time by simply contacting your bank or building society. Written confirmation may be required. Please also notify us at the National Zakat Foundation.
            </div>

            <back-btn :primary="true">
                Back
            </back-btn>

        </div>
    </scroll-container>
</template>

<script>
    import ScrollContainer from '../scroll/ScrollContainer';
    import BackBtn from '../inputs/BackBtn';

    export default {
        name: "PaymentPage",
        components: {
            ScrollContainer,
            BackBtn
        },
        mounted(){
            window.scrollTo(0, 0);

            if(this.$route.hash){
                this.$store.commit('SET_BACK_HASH', this.$route.hash);
            }
        },
        destroyed(){
            this.$store.commit('SET_BACK_HASH', '');
        }
    }
</script>
