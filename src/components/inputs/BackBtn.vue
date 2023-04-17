<template>
    <div>
        <div v-if="primary">

            <btn @click="goBack" class="-active">
                <slot></slot>
            </btn>

        </div>
        <div v-else class="back-btn md:bg-white md:rounded-full md:border border-gray-100 cursor-pointer">
            <a class="text-bold md:py-3 block md:text-center text-base leading-none font-semibold"
               @click="goBack">

                <slot></slot>

            </a>
        </div>
    </div>
</template>

<script>
    import Btn from './Btn';
    import { paths } from '../../utils/GlobalVars';
    import { mapState } from 'vuex';

    export default {
        name: "BackBtn",
        props:['primary'],
        components: { Btn },
        methods: {
            goBack() {
                let prev;

                if(this.$route.name == 'other-ways' || this.$route.name == 'direct-debit-guarantee'){
                    prev = localStorage.getItem('last-route') !== '/' ? localStorage.getItem('last-route') : paths.calculator;
                } else {
                    prev = this.$route.meta.prev;
                }

                //if there is a previous route go to it, otherwise go '/'
                (prev.length) ? this.$router.push({path: prev, hash: this.hash}) : this.$router.push('/');
            }
        },
        computed: {
            ...mapState({
                hash: state => state.transitions.backHash
            })
        }
    }
</script>

<style scoped>
    .back-btn {
        max-width: 120px;
    }
</style>
