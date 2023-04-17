<template>
    <div class="px-8 pt-4 pb-3 rounded flex justify-between text-white shadow items-center"
         :class="{
            'bg-red-100' : type == 'red',
            'bg-orange-500' : type == 'amber'
          }">
        <div class="w-11/12">
            <slot></slot>
        </div>

        <div class="w-1/12 flex justify-end">
            <div class="text-3xl close-btn-container">
                <span @click="emitClose" class="ion-ios-close-circle cursor-pointer"></span>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ErrorMessage",
        props: {
            type: {
                type: String,
                default: 'red'
            }
        },
        methods: {
            emitClose(){
                this.$emit('close');
                this.$store.commit('CLEAR_ERRORS', false);
            }
        }
    }
</script>
