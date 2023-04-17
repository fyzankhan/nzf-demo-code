<template>
    <div class="w-full">
        <radio :buttons="uniqButtons"
               :full-width="true"
               name="donation-round"
               @change="updateZakat"></radio>
    </div>

</template>

<script>
    import Radio from './inputs/Radio';
    import { mapActions } from 'vuex';
    import { mapFields } from 'vuex-map-fields';
    import { zakatCalc, numberWithCommas } from '../utils/helpers';
    import _ from 'lodash';

    export default {
        name: "RoundDonation",
        components: { Radio },
        methods: {
            updateZakat(val){

                this.roundingType = val;

                if(val == 1){
                    this.$store.dispatch('roundZakatOne');
                    this.$store.dispatch('updateDonationsAmount', this.donationSplit);
                    return;
                } else if (val == 2){
                    this.$store.dispatch('roundZakatTen');
                    this.$store.dispatch('updateDonationsAmount', this.donationSplit);
                    return;
                } else if (val == 3){
                    this.$store.dispatch('roundZakatHundred');
                    this.$store.dispatch('updateDonationsAmount', this.donationSplit);
                    return;
                } else if (val == 4){
                    this.$store.dispatch('resetZakat');
                    this.$store.dispatch('updateDonationsAmount', this.donationSplit);
                    return;
                } else if (val == 5){
                    this.$store.dispatch('roundZakatFifty');
                    this.$store.dispatch('updateDonationsAmount', this.donationSplit);
                    return;
                }
            },
            roundOne(){
                return numberWithCommas(Math.ceil(zakatCalc())).toLocaleString()
            },
            roundTen(){
               return numberWithCommas(Math.ceil(zakatCalc() / 10) * 10).toLocaleString();
            },
            roundFifty(){
               return numberWithCommas(Math.ceil(zakatCalc() / 50) * 50).toLocaleString();
            },
            roundHundred(){
               return numberWithCommas(Math.ceil(zakatCalc() / 100) * 100).toLocaleString()
            }
        },
        computed:{
            ...mapFields([
                'donation.donationSplit',
                'donation.roundingType'
            ]),
            ...mapActions([
                'roundZakatOne',
                'roundZakatTen'
            ]),
            buttons(){
                let roundOneTen = {
                    [this.roundOne()]:{
                        name: '£' + this.roundOne(),
                        value: '1',
                        selected: this.roundingType == 1,
                        id: this.roundOne(),
                    },
                    [this.roundTen()]:{
                        name: '£' + this.roundTen(),
                        value: '2',
                        selected: this.roundingType == 2,
                        id: this.roundTen()
                    }
                };

                let roundObjSmall = {
                    [this.roundOne()]:{
                        name: '£' + this.roundOne(),
                        value: '1',
                        selected: this.roundingType == 1,
                        id: this.roundOne()
                    },
                    [this.roundTen()]:{
                        name: '£' + this.roundTen(),
                        value: '2',
                        selected: this.roundingType == 2,
                        id: this.roundTen()
                    },
                    [this.roundHundred()]:{
                        name: '£' + this.roundFifty(),
                        value: '5',
                        selected: this.roundingType == 5,
                        id: this.roundFifty()
                    },
                };

                let roundObjLarge = {
                    [this.roundOne()]:{
                        name: '£' + this.roundOne(),
                        value: '1',
                        selected: this.roundingType == 1,
                        id: this.roundOne()
                    },
                    [this.roundTen()]:{
                        name: '£' + this.roundTen(),
                        value: '2',
                        selected: this.roundingType == 2,
                        id: this.roundTen()
                    },
                    [this.roundHundred()]:{
                        name: '£' + this.roundHundred(),
                        value: '3',
                        selected: this.roundingType == 3,
                        id: this.roundHundred()
                    },
                };

                let buttons = [];

                if(zakatCalc() >= 1000){
                    buttons = Object.keys(roundObjLarge).map(function(key) {
                        return roundObjLarge[key];
                    });
                } else if(zakatCalc() >= 50){
                    buttons = Object.keys(roundObjSmall).map(function(key) {
                        return roundObjSmall[key];
                    });
                } else {
                    buttons = Object.keys(roundOneTen).map(function(key) {
                        return roundOneTen[key];
                    });
                }

                buttons.push(
                    {
                        name: 'No, keep my Zakat value as £' + numberWithCommas(zakatCalc()),
                        value: '4',
                        selected: this.roundingType == 4,
                        id: numberWithCommas(zakatCalc())
                    }
                );

                return _.uniqBy(buttons.reverse(), 'id').reverse();
                // return buttons;
            },
            uniqButtons(){
                return _.uniqBy(this.buttons, 'name');
            }
        },
        mounted(){
            if(this.roundingType) {
                this.updateZakat(this.roundingType)
            }
        }
    }
</script>

<style scoped>

</style>
