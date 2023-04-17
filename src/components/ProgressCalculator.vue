<template>
    <div class="progress-calculator" v-if="steps > 0">
        <div class="flex flex-row-reverse md:flex-col justify-center items-center md:bg-white md:shadow-lg md:py-8 md:px-6 rounded md:mb-8  transition-all">
            <p class="w-3/12 md:w-full md:mb-6 flex justify-end md:justify-start text-blue-200 font-semibold text-lg">
                Step {{calculatorStep ? calculatorStep : 0}} of {{steps}}
            </p>

            <progress-bar class="w-9/12 md:w-full md:pb-1" :width="calculatorProgress"></progress-bar>
        </div>
        <calculation-basket></calculation-basket>
        <div class="hidden md:block">
            <p class="text-xs mt-12">Still have questions? Email us on 
                <!-- <a href="mailto:zakatquery@nzf.org.uk" class="text-blue-100">zakatquery@nzf.org.uk</a>  -->
                 <a class="text-blue-100" href="https://nzf.org.uk/about-nzf/get-in-touch/?utm_campaign=give-consent&utm_medium=payment&utm_source=giveapp&utm_content=application">Get in touch</a>
                and we’d be happy to help with any questions you have.</p>
        </div>
    </div>
</template>

<script>
    import ProgressBar from './ProgressBar';
    import CalculationBasket from './CalculationBasket';
    import { mapFields } from 'vuex-map-fields';

    export default {
        name: "ProgressCalc",
        components: {ProgressBar, CalculationBasket},
        props: {
            useHeight: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapFields([
                'calculatorProgress',
                'user.assets',
                'calculatorFilter',
                'calculatorStep'
            ]),
            progress(){
                return this.calculatorProgress/10;
            },
            steps(){
                let check1 = this.calculatorFilter.selected.map(el => el.name).includes('liabilities-mortgages') ? 1 : 0;
                let check2 = this.calculatorFilter.selected.map(el => el.name).includes('liabilities-bills') ? 1 : 0;
                let check3 = this.calculatorFilter.selected.map(el => el.name).includes('liabilities-personal-loans') ? 1 : 0;
                let check4 = this.calculatorFilter.selected.map(el => el.name).includes('liabilities-overdrafts') ? 1 : 0;
                let check5 = this.calculatorFilter.selected.map(el => el.name).includes('liabilities-credit-cards') ? 1 : 0;
                let check6 = this.calculatorFilter.selected.map(el => el.name).includes('liabilities-tax-etc') ? 1 : 0;
                let result = (check1 + check2 + check3 + check4 + check5 + check6) - 1
                if(result > 0){
                    this.calculatorStep - result;
                    return this.calculatorFilter.selected.length - result;
                } else {
                    return this.calculatorFilter.selected.length;
                }
            }
        }
    }
</script>

<style scoped lang="scss">

</style>
