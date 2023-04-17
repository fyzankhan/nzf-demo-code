<template>
    <select-input
            :value="value"
            id="regulardonationdateselect"
            :options="startDates"
            :small="true"
            :validators="{required: v.required}"
            @click="dateSelected"
            errormessage="Required"
            @errors="passErrors"></select-input>
</template>

<script>
    import SelectInput from './SelectInput';
    import moment from 'moment';
    import { mapFields } from 'vuex-map-fields';
    import validators from '../../utils/validators';

    export default {
        name: "DateSelect",
        components: { SelectInput },
        props: ['value'],
        methods: {
            formatDateUk(date){
                return date.format('DD/MM/YY');
            },
            dateSelected(date){
                this.paymentStartDate = moment(date, 'DD/MM/YY').format('YY-MM-DD')
            },
            passErrors(error){
                this.$emit('errors', error);
            }
        },
        computed: {
            firstOfMonth(){
                // to days date
                let start = moment();

                // First of next month
                let next1Month = moment().add(1, 'month').startOf('month');
                let next2Month = moment().add(2, 'month').startOf('month');

                //difference between first of next month and today
                let firstOfNextDifference = next1Month.diff(start, 'days');

                if(firstOfNextDifference > 15) {
                    return next1Month;
                } else {
                    return next2Month;
                }
            },
            startDates() {
                let dateList = [
                    this.firstOfMonth,
                    this.fifteenthOfMonth
                ];

                dateList = dateList.sort((a, b) => a.valueOf() - b.valueOf());

                return dateList.map((el) => this.formatDateUk(el))
            },
            fifteenthOfMonth(){
                let start = moment();
                let this15Month = moment().set('date', 15);
                let next15Month = moment().add(1, 'month').set('date', 15);

                let difference = next15Month.diff(start, 'days');

                if(difference > 15){
                    return next15Month;
                } else {
                    return this15Month;
                }
            },
            ...mapFields([
                'user.paymentDetails.paymentStartDate'
            ]),
            v() {
                return {...validators}
            }
        }
    }
</script>

<style scoped>

</style>
