<template>
    <div class="flex w-full flex-col w-full" @mouseover="showTrash = true" @mouseleave="showTrash = false">
        <slide-up-down :active="addFields && fields.length > 0">
                <div class="hidden sm:flex text-sm sm:text-lg font-semibold mb-2 font-heading-2">
                    <div class="w-1/2">Name</div>
                    <div class="w-1/2 ml-8">Value</div>
                </div>

                <slide-up-down v-for="(field, index) in fields"
                               :key="field.id + index"
                               slide-up-down
                               :active="activeKeys.includes(field.id)"
                               @close-end="deleteField(field.id)">

                    <div class="flex w-full relative flex-wrap sm:flex-no-wrap">
                        <div class="w-full sm:w-1/2 sm:mr-4 mb-6 text-input transition-all">
                            <label class="mb-2 sm:hidden flex justify-between">
                                <span class="font-semibold text-gray ">Name</span>

                                <span>
                                    <i class="ion-md-trash cursor-pointer text-gray-400" @click="deleteField(field.id)"></i>
                                </span>
                            </label>

                            <input class="focus:outline-none w-full input-container -large p-4"
                                   type="text"
                                   :id="`new-field-name-${field.id}`"
                                   name="new-field-name"
                                   v-model="field.name"
                                   placeholder="Add name"
                                   @input="updateStore(field)">
                        </div>

                        <div class="w-full sm:w-1/2 sm:ml-4 mb-6 relative text-input transition-all">
                            <label class="mb-2 sm:hidden text-gray font-semibold ">Value</label>

                            <div class="relative">
                                <input class="focus:outline-none w-full input-container -currency -large p-4 pr-4 pl-16"
                                       :class="{
                                        'error': field.error
                                       }"
                                       type="text"
                                       :id="`new-field-value-${field.id}`"
                                       pattern="[0-9]*" inputmode="numeric"
                                       name="new-field-value"
                                       title=""
                                       v-model="field.value"
                                       placeholder="Add value"
                                       @input="updateStore(field)">

                                <span class="text-xl currency-icon">&#163;</span>
                            </div>

                            {{amountCheck(field)}}

                            <div class="error-container text-red-100 mt-2" v-if="field.error">
                                <div>
                                    Please enter a valid value
                                </div>
                            </div>
                        </div>

                        <div @mouseover="showTrash = true" class="w-8 h-12 absolute right-0 mt-1 -mr-8">
                            <transition name="fade">
                                <div class="items-center text-gray-400 absolute top-0 w-8 h-full justify-center right-0 hidden sm:flex"
                                     v-if="showTrash">
                                    <i class="ion-md-trash cursor-pointer" @click="slideCloseField(field.id)"></i>
                                </div>
                            </transition>
                        </div>
                    </div>
                </slide-up-down>
            </slide-up-down>

        <div>
            <button class="
                add-more-btn
                focus:outline-none
                text-black text-base mb-3 md:mb-6 mx-2
                flex items-center
                hover:text-gray-500 transition-all" @click="addField">

                <i class="ion-ios-add text-xl mr-2 font-semibold"></i>

                {{getLabel('Add another field')}}

            </button>
        </div>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { amountCheck } from '../utils/validators';
    import { isSm } from '../utils/helpers';
    import { pull } from 'lodash';

    export default {
        name: "AddAnotherField",
        props: {
            otherFields: {
                type: [Array, Object, String],
                required: true
            },
            assetName: {
                type: String,
                required: true
            },
            show: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                fields: [],
                addFields: false,
                showTrash: false,
                activeKeys: []
            }
        },
        methods: {
            slideCloseField(id) {
                pull(this.activeKeys, id);
                this.$forceUpdate()
            },
            addField() {
                let id = Math.floor(Math.random() * this._uid) + new Date().getTime();
                this.addFields = true;

                if (this.activeKeys.length) {

                    if(isSm){
                        this.activeKeys.push(id);
                    } else {
                        setTimeout(() => {
                            this.activeKeys.push(id);
                        });
                    }

                } else {
                    this.activeKeys.push(id);
                }

                this.fields.push({
                    id: id,
                    name: '',
                    value: '',
                    error: false
                });
            },
            updateStore(field) {
                switch (this.assetName) {
                    case 'cash':
                        this.$store.dispatch('addCashAsset', field);
                        break;
                    case 'liabilities':
                        this.$store.dispatch('addLiabilitiesAsset', field);
                        break;
                    case 'businessAssets':
                        this.$store.dispatch('addBusinessAsset', field);
                        break;
                    case 'crypto':
                        this.$store.dispatch('addCryptoAsset', field);
                        break;
                    case 'investment':
                        this.$store.dispatch('addInvestmentAsset', field);
                        break;
                    case 'moneyOwed':
                        this.$store.dispatch('addMoneyOwedAsset', field);
                        break;
                    case 'goldSilver':
                        this.$store.dispatch('addGoldSilverAsset', field);
                        break;
                    default:
                        console.warn("your asset name did not match a switch case to update the store. Check asset name exists, and String format is correct");
                }
            },
            deleteField(id){
                // let index = this.fields.map((el) => el.id).indexOf(id);

                this.fields = this.fields.filter(el => el.id !== id);

                this.$store.commit('REMOVE_ASSETS', {
                    assetName: this.assetName,
                    id
                });
            },
            amountCheck(field){
                if(field.value.length > 0){
                    this.fields.filter(el => el.id == field.id)[0].error =  !amountCheck(field.value);
                }
            }
        },
        computed:{
            ...mapGetters([
                'getLabel'
            ])
        },
        mounted() {
            this.fields = [...this.otherFields];

            this.activeKeys = this.fields.map(el => el.id).length > 0 ? this.fields.map(el => el.id) : [];

            //if there are already other fields then set addFields to true so they can be displayed
            if (this.fields.length) {
                this.addFields = true;
            }
        },
        watch: {
            show(to){
                if(!to){
                    this.fields.forEach((el) => {
                        this.deleteField(el.id);
                    })
                }

            }
        }
    }
</script>
