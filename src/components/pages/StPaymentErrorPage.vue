<template>
    <scroll-container id="top">
        <div class="pt-32 pb-10 px-4 lg:px-0"  style="z-index: 30" >

            <h1 class="header-2 header mb-8">{{ page.title }}</h1>


            <div class="mb-4" v-html="page.content">

            </div>
        </div>
    </scroll-container>
</template>

<script>
    import ScrollContainer from '../scroll/ScrollContainer';

    export default {
        name: "PaymentErrorPage",
        components: {
            ScrollContainer
        },
        computed:{
            page(){
                return this.$store.state.pages.stErrorPage;
            }
        },
        mounted(){
            window.scrollTo(0, 0);
            this.$store.dispatch('fetchStErrorPagePage');
        }
    }
</script>
