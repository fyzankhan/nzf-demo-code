<template>
    <div>
        <vue-custom-scrollbar class="scroll-area" :settings="settings">
            <donation-sidebar class="pb-20 px-4"></donation-sidebar>
        </vue-custom-scrollbar>
    </div>
</template>

<script>
    import vueCustomScrollbar from 'vue-custom-scrollbar';
    import DonationSidebar from '../DonationSideBar';
    export default {
        name: "DonationSideBarContainer",
        components: {  vueCustomScrollbar, DonationSidebar },
        data(){
            return {
                settings: {}
            }
        }
    }
</script>

<style scoped>

</style>
