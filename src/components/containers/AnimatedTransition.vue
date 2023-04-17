<template>
    <transition @enter="enter" @leave="leave" :css="false">
        <slot />
    </transition>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "AnimatedTransition",
        methods: {
            enter(el, done) {
                this.childEl = el.__vue__;

                if (!_.isUndefined(this.childEl['transitionIn'])) {
                    this.childEl['transitionIn'](done);
                }
            },
            leave(el, done) {
                if (!_.isUndefined(this.childEl['transitionOut'])) {
                    this.childEl['transitionOut'](done);
                } else {
                    setTimeout(done, 1000);
                }
            }
        }
    }
</script>

<style scoped>

</style>