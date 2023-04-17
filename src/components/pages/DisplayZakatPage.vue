<template>
    <div>
        <scroll-container>
            <full-page-slide class="center -first" :nextBtn="zakatNextButton">
               <display-zakat></display-zakat>
            </full-page-slide>

            <full-page-slide :nextBtn="{text: 'Continue', skip: false, path: '/donation', conditional: true}" v-if="showRound">
                <div class="step">{{getLabel('Scroll up for previous question')}}</div>

                <h2 class="header header-2 text-3xl mb-4">{{getLabel('Would you like to round up your zakat')}}</h2>

                <p class="sub-text mb-8">
                    {{ getLabel('Roundup Paragraph')}}
                </p>

                <round-donation></round-donation>
            </full-page-slide>
        </scroll-container>
    </div>
</template>

<script>
    import FullPageSlide from '../FullPageSlide';
    import RoundDonation from '../RoundDonation';
    import ScrollContainer from '../scroll/ScrollContainer';
    import DisplayZakat from '../DisplayZakat';
    import { mapGetters } from 'vuex';

    export default {
        name: "DonationPage",
        components: { RoundDonation, FullPageSlide, ScrollContainer, DisplayZakat },
        computed:{
            zakatNextButton(){
                if(this.showRound){
                    return {text: 'Continue', skip: false, conditional: true }
                } else {
                    return {text: 'Continue', skip: false, path: '/donation', conditional: true}
                }
            },
            showRound(){
                return this.getOriginalZakat() % 10
            },
            ...mapGetters([
                'getLabel',
                'getOriginalZakat'
            ])
        },
        mounted(){
            window.scrollTo(0, 0);
        }
    }
</script>

<style scoped lang="scss">
    .help-icon {
        font-size: 22px;
    }

    .icon-container {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        i {
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
</style>