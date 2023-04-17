<template>
    <div class="overflow-hidden">
        <div class="flex justify-between items-center cursor-pointer"  @click="toggle">
            <div class="flex items-center">
                <!--<div class="w-full sm:pr-4 text-blue-200 text-xl sm:text-2xl font-semibold mb-2 header header-3">-->
                <div class="w-full sm:pr-4 text-blue-200 text-xl sm:text-2xl font-semibold mb-2 font-heading-2">
                    {{title}}
                </div>

                <div class="mb-1 pl-4">
                    <slot #toolTip></slot>
                </div>
            </div>

            <div class="h-12 sm:h-8 w-4 relative text-4xl">
                <span class="absolute left-0 top-0 h-full flex justify-center items-center" v-if="!show">
                    <i class="ion-ios-add"></i>
                </span>

                <span class="absolute left-0 top-0 h-full flex justify-center items-center" v-else>
                    <i class="ion-ios-remove"></i>
                </span>
            </div>
        </div>

        <transition name="fadeHeight">
            <div v-if="show" >
                <slot name="item"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: "AccordionItem",
        props: {
            title: {
                type: String
            },
            open: {
                type: Boolean,
                default: () => {
                    return screen.width > 751
                }
            }
        },
        data(){
            return {
                show: true
            }
        },
        methods: {
            toggle(){
                this.show = !this.show;
            }
        },
        beforeMount(){
            this.show = this.open;
        }
    }
</script>

<style scoped>

</style>
