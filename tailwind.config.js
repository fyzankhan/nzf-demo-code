module.exports = {
    theme: {
        screens: {
            sx: '320px',
            xs: '640px',
            sm: '750px',//'640px',
            md: '992px',//'768px',
            lg: '1200px',//'1024px',
            xl: '1640px'//'1280px',
        },
        extend: {
            colors: {
                black: {
                    default: '#312525'
                },
                red: {
                    default: '#EEB8BB',
                    100: '#db3c42',
                    200: '#644B96',
                },
                blue: {
                    default: '#E5F0F9',
                    100: '#2C91DC',
                    200: '#1b3f92'
                },
                gray: {
                    default: '#696969',
                    0: '#E5E5E5',
                    100: '#D2D2D2',
                    200: '#B3B3B3',
                    300: '#727272',
                    400: '#696969',
                    500: '#969696'
                },
                white: {
                    default: '#FFFFFF',
                    100: 'rgba(255,255,255,0.8)',
                },
                green: {
                    default: '#1d9868',
                    100: '#F2F9F6',
                    200: '#37A479'
                },
                purple: {
                    100: '#F9F8FA'
                }
            },
            width: {
                '12/25': '48%',
                '1/4': '25%'
            },
            lineHeight: {
                zero: 0
            },
            fontSize: {
                '2xs': '.5rem',
                '1-5xl': '1.38rem',
                '2-5xl': '1.75rem',
                '3-5xl': '2rem',
                '3-7xl': '2.13rem',
                '4-5xl': '2.75rem',
                '5-5xl': '3.5rem',

                //text-2xs is       8px at 1920 wide
                //text-xs  is       12px at 1920 wide
                //text-sm is        14px at 1920 wide
                //text-base is      16px at 1920 wide
                //text-lg is        18px at 1920 wide
                //text-xl is        20px at 1920 wide
                //text-1.5xl is     22px at 1920 wide
                //text-2xl is       24px at 1920 wide
                //text-2.5xl is     28px at 1920 wide
                //text-3xl is       30px at 1920 wide
                //text-3.5xl is     32px at 1920 wide
                //text-3.7xl is     34px at 1920 wide
                //text-4xl is       36px at 1920 wide
                //text-4.5xl is     40px at 1920 wide
                //text-5xl is       48px at 1920 wide
                //text-5.5xl is     60px at 1920 wide
                //text-6xl is       64px at 1920 wide
            },
            spacing: {
                '0-5': '0.3rem',
                '18': '4.5rem'
            }
        },
        boxShadow: {
            'default': '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)',
            'lg': '0px 0px 10px #4A348533',
            'outline': '0 0 0 3px rgba(102,102,102,0.5)',
            'nav': '0px 3px 6px #00000029',
        }
    },
    variants: {
        lineHeight: ['responsive']
    }
};
