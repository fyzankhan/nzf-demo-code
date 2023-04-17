<template>
    <div class="w-full">
        <div class="w-full relative md:max-w-xl md:m-auto sm:pl-12 md:px-10 w-3/5">
            <div class="w-full relative z-10 -mt-2" :class="{'mode-give' : this.mode === 'give'}">

                <div class="nav-progress bg-gray-200"></div>
                <div class="nav-progress bg-green absolute top-0 transition-all" :class="progress()"></div>

                <div class="progress-mark-1 absolute top-0 progress-mark rounded-full bg-green"></div>

                <div class="progress-mark-2 absolute top-0 progress-mark rounded-full transition-all"
                     :class="{
                        '-active': this.activeTab >= 1 || this.historyCheck(paths.donation),
                        'bg-gray-200': this.activeTab < 1 && !this.historyCheck(paths.donation)
                     }">
                </div>

                <div class="progress-mark-3 absolute top-0 progress-mark rounded-full transition-all"
                     :class="{
                        '-active': this.activeTab >=2 || this.historyCheck(paths.support),
                        'bg-gray-200': this.activeTab < 2 && !this.historyCheck(paths.support)
                     }">
                </div>

                <div class="progress-mark-4 absolute top-0 progress-mark -ml-2 rounded-full transition-all"
                     :class="{
                        '-active': this.activeTab >= 3 || this.historyCheck(paths.payment),
                        'bg-gray-200': this.activeTab < 3 && !this.historyCheck(paths.payment)
                     }">
                </div>
            </div>

            <div class="flex justify-between">
                <div v-for="(route,index) in computedRoutes"  :key="index"
                     class="link-container relative" @click="setTab(index)">
                    <router-link :to="route.path"
                                 :id="route.path.replace('/', '') + id"
                                 class="p-2 pt-3 absolute text-gray-200 text-sm font-semibold capitalize"
                                 >
                                 <!-- Removed because links were not clickable :class="{ 'pointer-events-none': isActive(route.path) }" -->
                        {{route.text}}
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import  { mapGetters, mapState } from 'vuex';
    import { mapFields } from 'vuex-map-fields';
    import { paths } from '../utils/GlobalVars';
    export default {
        name: "LineNav",
        props:{
            id: {
                default: ''
            }
        },
        data(){
            return {
                activeTab: 0,
                lastWidth: ''
            }
        },
        methods: {
            setTab(index){
                if(this.$route.name !== "thankyou"){
                this.activeTab = index;
                this.setHistory(this.routes[index]);
                this.lastWidth = this.progress();
                this.progress();
                this.$store.dispatch('setProgressBar',{
                        step: index
                    });
                }
            },
            setHistory(path){
                if(!this.history.includes(path)){
                    this.history.push(path);
                    this.pastTabs.push(this.routes.indexOf(path));
                }
            },
            historyCheck(path){
                return this.history.includes(path);
            },
            isActive(path){
                //TODO: uncomment for live site

                return !this.historyCheck(path);
                // return false;
            },
            progress(){
                if(this.calculatorProgress == 0)
                    return 'w-0';
                else if(this.calculatorProgress == 1)
                    return 'w-1/3';
                else if(this.calculatorProgress == 2)
                    return 'w-2/3';
                else if(this.calculatorProgress == 3)
                    return 'w-full';
                else if(this.activeTab == 3 && this.largestIndex <= 3)
                    return 'w-full';
                else if(this.activeTab == -1)
                    return 'w-full';
                if(this.activeTab == 0 && this.largestIndex <= 0) {
                    return 'w-0';

                } else if(this.activeTab == 1 && this.largestIndex <= 1){
                    return 'w-1/3';

                } else if (this.activeTab == 2 && this.largestIndex <= 2) {
                    return 'w-2/3';

                } else if (this.activeTab == 3 && this.largestIndex <= 3) {
                    return 'w-full';

                } else if (this.activeTab == -1) {
                    return 'w-full';

                } else {
                    return this.lastWidth;
                }
            }
        },
        computed: {
            ...mapState({
                mode: state => state.mode,
                calculatorProgress: state => state.calculatorProgress
            }),
            ...mapFields([
                'transitions.history',
                'pastTabs'
            ]),
            ...mapGetters([
                'getLabel'
            ]),
            routes(){
                return [
                    paths.calculator,
                    paths.donation,
                    paths.support,
                    paths.payment,
                ]
            },
            paths(){
                return paths;
            },
            largestIndex(){
                let val = this.pastTabs.length > 0 ? this.pastTabs : [];
                return Math.max(...val);
            },
            computedRoutes(){
                if(this.mode !== 'give') {
                    return [
                        {
                            path: this.routes[0],
                            text: this.getLabel('Calculator')
                        },
                        {
                            path: this.routes[1],
                            text: this.getLabel('Give Zakat')
                        },
                        {
                            path: this.routes[2],
                            text: this.getLabel('Support NZF')
                        },
                        {
                            path: this.routes[3],
                            text: this.getLabel('Payment')
                        }
                    ]
                } else {
                    return [
                        {
                            path: this.routes[1],
                            text: this.getLabel('Give Zakat')
                        },
                        {
                            path: this.routes[2],
                            text: this.getLabel('Support NZF')
                        },
                        {
                            path: this.routes[3],
                            text: this.getLabel('Payment')
                        }
                    ]
                }
            }
        },
        mounted(){
            // this.setTab(this.routes.indexOf(this.$route.path));
            this.setTab(this.calculatorProgress);
            
            let to = this.$route.name;
            if(to == 'thankyou') {
                this.history.push(this.routes);
                this.activeTab = 4;
            }
        },
        watch: {
            $route(to) {
                this.setTab(this.routes.indexOf(to.path));

                let el = document.getElementById('line-nav-mob-container');

                if(to.name == 'support' || to.name == 'payment' || to.name == 'thankyou'){
                    el.scrollLeft = el.scrollWidth;
                } else {
                    el.scrollLeft = 0;
                }

                if(to.name == 'thankyou') {
                    this.history.push(this.routes);
                    this.activeTab = 4;
                }
            }
        }
    }
</script>

<style scoped>

</style>
