<template>
    <div>
         <div class="mb-6">
             <!-- Add sm:text-lg -->
             <p class="mb-4 ">{{getLabel('Filter Sub Text')}}</p>

             <div class="header-1 header mb-4 md:mb-12">{{getLabel('What I Own')}}</div>

             <checkbox class="mb-8"
                       @update="selectSectionOwned"
                       :checkboxes="sectionsAssets"
                       :cols="2">
             </checkbox>
         </div>

        <div>
            <div class="header-1 header mb-4 md:mb-12 -red">{{getLabel('What I Owe')}}</div>

            <checkbox class="mb-8"
                      @update="selectSectionOwed"
                      :checkboxes="sectionsOwed"
                      :cols="2">
            </checkbox>
        </div>
    </div>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import Checkbox from './inputs/Checkbox';
    import _ from 'lodash';

    export default {
        name: "CalculatorFilter",
        components: { Checkbox },
        data(){
            return {
                assetsArr: [],
                owedArr: []
            }
        },
        methods: {
            selectSectionOwned(val){
                this.assetsArr = val;

                this.assetsArr = this.assetsArr.map((el) => {
                    return {
                        name: el,
                        step: this.sectionsAssetsList.filter((item) => item.id == el)[0].step
                    }
                });

                this.assetsArr = _.sortBy(this.assetsArr, function(o){return o.step});

                let arr = _.sortBy(this.owedArr.concat(this.assetsArr), function(o){return o.step});

                this.$store.commit('SET_SECTIONS', arr );
                this.$store.commit('CLEAR_CALC_STEP');
            },
            selectSectionOwed(val){
                this.owedArr = val;

                this.owedArr = this.owedArr.map((el) => {
                    return {
                        name: el,
                        step: this.sectionsOwedList.filter((item) => item.id == el)[0].step
                    }
                });

                let arr = _.sortBy(this.owedArr.concat(this.assetsArr), function(o){return o.step});

                this.$store.commit('SET_SECTIONS',  arr);
                this.$store.commit('SET_SECTIONS',  arr);
                this.$store.commit('CLEAR_CALC_STEP');
            }
        },
        computed:{
            ...mapState({
                calculatorFilter: state => state.calculatorFilter,
            }),
            ...mapGetters([
                'getLabel'
            ]),
            sectionsAssets() {
                return this.sectionsAssetsList.map((el, index)=> {
                    let isSelected = this.calculatorFilter.selected;

                    isSelected = _.flatMap(isSelected, function (el) {
                        return el.name
                    })

                    return {
                        name: el.name,
                        value: el.id,
                        step: el.step,
                        selected: isSelected.includes(el.id)
                    }
                })
            },
            sectionsOwed() {
                return this.sectionsOwedList.map((el, index)=> {
                    let isSelected = this.calculatorFilter.selected;

                    isSelected = _.flatMap(isSelected, function (el) {
                        return el.name
                    })

                    return {
                        name: el.name,
                        value: el.id,
                        step: el.step,
                        selected: isSelected.includes(el.id)
                    }
                })
            },
            sectionsAssetsList(){
                return [
                    {
                        name: 'Cash',
                        id:'cash-valuation',
                        step: 1
                    },
                    {
                        name: 'Pensions',
                        id:'pensions',
                        step: 5
                    },
                    {
                        name: 'Money owed to me',
                        id:'money-owed-to-you',
                        step: 2
                    },
                    {
                        name: 'ISAs and trusts',
                        id:'isas',
                        step: 6
                    },
                    {
                        name: 'Gold and Silver',
                        id:'gold-and-silver',
                        step: 3
                    },
                    {
                        name: 'Crypto',
                        id:'crypto',
                        step: 7
                    },
                    {
                        name: 'Shares',
                        id:'shares-and-investments',
                        step: 4
                    },
                    {
                        name: 'Business assets',
                        id:'business-assets',
                        step: 8
                    }
                ]
            },
            sectionsOwedList(){
                return [
                    {
                        name: 'Mortgage',
                        id:'liabilities-mortgages',
                        step: 9
                    },
                    {
                        name: 'Utility bills',
                        id:'liabilities-bills',
                        step: 10
                    },
                    {
                        name: 'Personal loans',
                        id:'liabilities-personal-loans',
                        step: 11
                    },
                    {
                        name: 'Overdraft',
                        id:'liabilities-overdrafts',
                        step: 12
                    },
                    {
                        name: 'Credit card',
                        id:'liabilities-credit-cards',
                        step: 13
                    },
                    {
                        name: 'Business liabilities',
                        id:'liabilities-tax-etc',
                        step: 14
                    },

                ]
            },
        },
        mounted(){
            this.assetsArr = this.sectionsAssets.filter(el => el.selected).map(el => {
                return {
                    name: el.value,
                    step: el.step
                }
            });

            this.owedArr = this.sectionsOwed.filter(el => el.selected).map(el => {
                return {
                    name: el.value,
                    step: el.step
                }
            });
        }
    }
</script>

<style scoped>

</style>
