<template>
    <div class="scroll-container">
        <div ref="fullpage" id="fullpage" class="scroll-hijack">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import { EventBus } from '../../utils/eventBus.js';
    import { mapFields } from 'vuex-map-fields';
    import _ from 'lodash';

    export default {
        name: "ScrollContainer",
        data() {
            return {
                pastIds:[]
            }
        },
        methods: {
            next(payload){

                let nextId = '';

                let id = payload.id;
                let step = payload.step;

                let visibleList = this.$slots.default.filter((el) => window.getComputedStyle(el.elm).display !== 'none');

                let index = _.findIndex(visibleList, (el) => {
                    return el.componentInstance.id == id
                });





                if(visibleList[index + 1] && visibleList[index + 1].elm){

                    // if(this.$slots.default[index + 1].elm){
                        nextId = visibleList[index + 1].elm.id;
                    // }

                } else if(visibleList[index + 1]){

                    // if(this.$slots.default[index + 1].componentInstance){
                        nextId = visibleList[index + 1].componentInstance.id;
                    // }

                } else {

                    nextId = null;

                }

                if(step > 0 && step <= this.calculatorFilter.selected.length) {
                    this.calculatorStep = step;
                    this.calculatorProgress = (step / this.calculatorFilter.selected.length) * 100;
                }

                if(nextId){
                    if(!this.pastIds.includes(id)){

                        this.pastIds.push(id);
                    }

                    this.$scrollTo('#'+nextId, 500, this.nextOffset());
                    return;
                } else {
                    this.calculatorProgress = this.calculatorFilter.selected.length * 10;
                    return;
                }
            },
            prev(payload){

                let prevId = '';
                let id = payload.id;
                let step = payload.step;

                this.calculatorStep = step;

                let visibleList = this.$slots.default.filter((el) => window.getComputedStyle(el.elm).display !== 'none');

                let index = _.findIndex(visibleList, (el) => {
                    return el.componentInstance.id == id
                });

                let prevIndex = index -1;

                if(visibleList[prevIndex] && visibleList[prevIndex].elm && visibleList[prevIndex].elm.id){

                    prevId = visibleList[prevIndex].elm.id;

                } else if(visibleList[prevIndex]){

                    prevId = visibleList[prevIndex].componentInstance.id;

                } else {
                    prevId = null;
                }

                if(step >= 0) {
                    this.calculatorProgress = (step / this.calculatorFilter.selected.length) * 100;
                }

                if(prevId.length){
                    this.$scrollTo('#'+prevId, 500, this.prevOffset())
                }
            },
            nextOffset(){
                let obj = {
                    offset: window.innerWidth > 750 ? -75 : 0
                };

                return obj;
            },
            prevOffset(){
                let obj = {
                    offset: window.innerWidth > 750 ? -75 : -70
                };

                return obj;
            }
        },
        computed: {
            ...mapFields([
                'calculatorProgress',
                'calculatorFilter',
                'calculatorStep'
            ])
        },
        mounted(){
            EventBus.$on('nextBtnClicked', this.next);
            EventBus.$on('prevBtnClicked', this.prev);
        },
        destroyed(){
            EventBus.$off('nextBtnClicked', this.next);
            EventBus.$off('prevBtnClicked', this.prev);
        }
    }
</script>

<style scoped>
    .section {
        text-align:center;
        font-size: 3em;
    }
    .content{
        margin:50px
    }

</style>
