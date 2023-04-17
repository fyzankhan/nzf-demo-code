
module.exports = {
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/assets/scss/main.scss";`
            },
            //TODO: add purge css

            postcss: {
                "plugins": [
                    require('tailwindcss')('tailwind.config.js'),
                    require('@fullhuman/postcss-purgecss')({

                        // Specify the paths to all of the template files in your project
                        content: [
                            './src/**/*.vue',
                            './src/**/*.scss'
                        ],
                        whitelistPatterns: [/fade/, /loader/, /sticky/, /open/, /slide/, /fadeHeight/, /sm/, /md/, /lg/],
                        // Include any special characters you're using in this regular expression
                        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
                    }),
                    require('autoprefixer')(),
                ]
            }
        }
    },
    runtimeCompiler: true,
    publicPath: '/',
    assetsDir: './static',
};
