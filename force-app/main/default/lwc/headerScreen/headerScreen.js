import { LightningElement, api, track,wire } from 'lwc';
import SMS from '@salesforce/resourceUrl/SMS';
import { NavigationMixin } from 'lightning/navigation';
export default class HeaderScreen extends NavigationMixin (LightningElement) {

    SMS = SMS;
  
    
    handleEventClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/"
            }
        });
 
    }

    handlemyProfileClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/my-profile-page"
            }
        });
    }

    handlemyMaintainanceReqClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/maintenance-request-page"
            }
        });
    }
     handleUtility(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/utility-page"
            }
        });
     }

     handlefeedbackClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/feedback-page"
            }
        });
     }

}