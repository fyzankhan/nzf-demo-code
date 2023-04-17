<template>
    <vue-custom-scrollbar class="scroll-area">
        <donation-side-bar :thank-you="true" class="pb-20 px-4"></donation-side-bar>
    </vue-custom-scrollbar>
</template>

<script>
    import DonationSideBar from '../DonationSideBar';
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    export default {
        name: "ThankYouSideBarContainer",
        components: { vueCustomScrollbar, DonationSideBar }
    }
</script>

<style scoped>

</style>
