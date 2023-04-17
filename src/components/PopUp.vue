<template>
    <div class="">
        <div class="bubble  p-4">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: "PopUp"
    }
</script>

<style scoped lang="scss">
    .bubble {
        position: relative;
        padding: 0px;
        -webkit-border-radius: 0px;
        -moz-border-radius: 0px;
        border-radius: 0px;

        div {
            padding: 20px;
        }
    }

    .bg-red {
        .bubble:after {
            content: '';
            position: absolute;
            border-style: solid;
            border-width: 0 15px 15px;
            border-color: #FEE7E7 transparent;
            display: block;
            width: 0;
            z-index: 1;
            top: -15px;
            left: 13px;
        }
    }

    .bg-blue {
        .bubble:after {
            content: '';
            position: absolute;
            border-style: solid;
            border-width: 0 15px 15px;
            border-color: #E5F0F9 transparent;
            display: block;
            width: 0;
            z-index: 1;
            top: -15px;
            left: 13px;
        }
    }
</style>