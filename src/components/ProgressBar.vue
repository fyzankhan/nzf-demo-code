<template>
    <div class="w-full relative ">
        <div class="w-full progress-bar bg-gray-400 opacity-25 rounded absolute"></div>
        <div class="progress-bar bg-green rounded absolute"
             :style="widthCalc"></div>
    </div>
</template>

<script>
    export default {
        props: ['width'],
        computed: {
            widthCalc(){
                return 'width:' + this.width + '%';
            }
        }
    }
</script>

<style scoped lang="scss">
    .progress-bar {
        height: 6px;
    }
</style>
