import CalculatorPage from './components/pages/CalculatorPage';
import DonationPage from './components/pages/DonationPage';
import SupportPage  from './components/pages/SupportPage';
import PaymentPage from './components/pages/PaymentPage';
import ThankYouPage from './components/pages/ThankYouPage';
import OtherWaysPage from './components/pages/OtherWaysPage';
import StPaymentErrorPage from './components/pages/StPaymentErrorPage';

import BackBtnContainer from './components/containers/BackBtnContainer';
import ProgressContainer from './components/containers/ProgressContainer';
import DonationSideBarContainer from './components/containers/DonationSideBarContainer';
import ThankYouSideBarContainer from './components/containers/ThankYouSideBarContainer';

import { paths } from './utils/GlobalVars';
import DirectDebitGuarantee from "./components/pages/DirectDebitGuarantee";

const routes = [
    {
        name: 'calculator',
        path: paths.calculator,
        components: {
            center: CalculatorPage,
            right: ProgressContainer
        },
        meta: {
            prev: '',
            next: paths.donation
        }
    },
    {
        name: 'donation',
        path: paths.donation,
        components: {
            left: BackBtnContainer,
            center: DonationPage,
            right: DonationSideBarContainer
        },
        meta: {
            prev: paths.calculator,
            next: paths.support,
            scrollTo: 'filter-section'
        }
    },
    {
        name: 'support',
        path: paths.support,
        components: {
            left: BackBtnContainer,
            center: SupportPage,
            right: DonationSideBarContainer
        },
        meta: {
            prev: paths.donation,
            next: paths.payment
        }
    },
    {
        name: 'payment',
        path: paths.payment,
        components: {
            left: BackBtnContainer,
            center: PaymentPage,
            right: DonationSideBarContainer
        },
        meta: {
            prev: paths.support,
            next: ''
        }
    },
    {
        name:'thankyou',
        path: paths.thankYou,
        components: {
            center: ThankYouPage,
            right: ThankYouSideBarContainer
        },
        meta: {
            prev: paths.support,
            next: ''
        }
    },
    {
        name: 'other-ways',
        path: paths.otherWays,
        components: {
            left: BackBtnContainer,
            center: OtherWaysPage,
            right: DonationSideBarContainer
        },
        meta: {
            prev: '',
            next: ''
        }
    },
    {
        name: 'direct-debit-guarantee',
        path: paths.directDebitGuarantee,
        components: {
            left: BackBtnContainer,
            center: DirectDebitGuarantee,
            right: DonationSideBarContainer
        },
        meta: {
            prev: '',
            next: ''
        }
    },
    {
        name: 'st-payment-error',
        path: paths.stPaymentError,
        components: {
            center: StPaymentErrorPage
        },
        meta: {
            prev: '',
            next: ''
        }
    }
];

export default routes;
