import PrivacyBanner from '../../../src';
    
window.addEventListener('DOMContentLoaded', () => {    
    window.__pb__ = PrivacyBanner.init({
        types: {
            'necessary': {
                fns: [
                    () => { console.log('Necessary fn'); }
                ]
            },
            'performance': {
                title: 'Performance preferences',
                description: 'Performance cookies are used to measure the performance of our website and make improvements. Your personal data is not identified.',
                labels: {
                    yes: 'Pages you visit and actions you take will be measured and used to improve the service',
                    no: 'Pages you visit and actions you take will not be measured and used to improve the service'
                },
                fns: [
                    () => { console.log('Performance fn'); }
                ]
            },
            'ads': {
                title: 'Set your personalised ads preferences',
                description: 'We work with advertising partners to show you ads for our products and services across the web.  You can choose whether we collect and share that data with our partners below. ',
                labels: {
                    yes: 'Our partners might serve you ads knowing you have visited our website',
                    no: 'Our partners will still serve you ads, but they will not know you have visited out website'
                },
                fns: [
                    () => { console.log('Ads fn'); }
                ]
            }
        }
    });
});

/*
Performance preferences
Performance cookies are used to measure the performance of our website and make improvements. Your personal data is not identified.
[  (BIG GREEN TICK)    I am OK with this  ]  Pages you visit and actions you take will be measured and used to improve the service 
[  (BIG RED X)    No thank you  ]  Pages you visit and actions you take will not be measured and used to improve the service 


Set your personalised ads preferences
We work with advertising partners to show you ads for our products and services across the web.  You can choose whether we collect and share that data with our partners below. 
[  (BIG GREEN TICK)    I am OK with this  ]   Our partners might serve you ads knowing you have visited our website
[  (BIG RED X)    No thank you  ]   Our partners will still serve you ads, but they will not know you have visited out website.
*/