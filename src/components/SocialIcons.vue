<template>
    <div class="flex items-center icon-container">
        <a :href="facebookPath" target="_blank">
            <div class="w-12 h-12 p-3 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full h-full">
                    <facebook-logo></facebook-logo>
                </div>
            </div>
        </a>

        <a :href="twitterPath" target="_blank">
            <div class="w-12 h-12 p-3 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full h-full">
                    <twitter-logo></twitter-logo>
                </div>
            </div>
        </a>

        <a :href="emailLink" target="_blank">
            <div class="w-12 h-12 p-2 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full">
                    <gmail-logo></gmail-logo>
                </div>
            </div>
        </a>

        <a href="https://wa.me/?text=I%27ve%20just%20donated%20with%20NZF%2C%20check%20this%20out!%20www.nzf.org.uk" target="_blank">
            <div class="w-12 h-12 p-3 border border-gray-100 ion-wrapper rounded-full flex justify-center items-center bg-white">
                <div class="w-full h-full">
                    <whatsapp-logo></whatsapp-logo>
                </div>
            </div>
        </a>
    </div>
</template>

<script>
    import facebookLogo from './icons/facebookLogo'
    import twitterLogo from './icons/twitterLogo'
    import gmailLogo from './icons/gmailLogo'
    import whatsappLogo from './icons/whatsappLogo'

    export default {
        name: "SocialIcons",
        components: { facebookLogo, twitterLogo, gmailLogo, whatsappLogo },
        computed: {
            emailLink() {
                return 'mailto:?subject=NZF -' + encodeURI(" I've just donated with NZF") + '&body=Hi, check this out! ' + 'www.nzf.org.uk';
            },
            facebookPath() {
                return 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURI('www.nzf.org.uk');
            },
            twitterPath() {
                return 'https://twitter.com/intent/tweet?url=' + encodeURI('www.nzf.org.uk') + '&text=@NZF ' + encodeURI("I've just donated with NZF");
            }
        }
    }
</script>

<style scoped lang="scss">
    .icon-container {
        margin: 0 -10px;

        .ion-wrapper {
            margin: 5px;
        }
    }
</style>
