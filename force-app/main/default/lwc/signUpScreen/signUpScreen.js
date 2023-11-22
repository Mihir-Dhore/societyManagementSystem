import { LightningElement,track,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import createAccountAndContact from '@salesforce/apex/SMSSignUpLogin.createAccountAndContact'
 
export default class SignupForm extends NavigationMixin(LightningElement) {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track Phone = '';
    @track Password = '';

    handleFirstNameChange(event) {
        this.firstName = event.target.value;
    }

    handleLastNameChange(event) {
        this.lastName = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handlePhoneChange(event) {
         this.Phone = event.target.value;

    }
    handlePasswordChange(event) {
        this.Password = event.target.value;
     }

    //Signup Functionality
         handleSignup() 
         {
            
            createAccountAndContact({
                firstName: this.firstName,
                lastName: this.lastName,
                email: this.email,
                Phone: this.Phone,
                Password: this.Password
            })
                .then(result => {
                    console.log(result);
                    this[NavigationMixin.Navigate]({
                        type: "standard__webPage",
                        attributes: {
                           url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/login"
                        }
                    });

 
                })
                .catch(error => {
                    // Handle errors here
                    console.error(error);
                });

     

                
    
        }
        handleLoginHereClick(event)
        {
            this[NavigationMixin.Navigate]({
                type: "standard__webPage",
                attributes: {
                   url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/login"
                }
            });
        }
     
 }
