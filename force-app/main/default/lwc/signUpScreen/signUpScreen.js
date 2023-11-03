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
        if (newPhoneNumber.length === 10) {
             this.Phone = newPhoneNumber;
        } else {
         }
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
                    // Handle the result, you can show a success message or handle errors here
                    console.log(result);
                    this.dispatchEvent(new ShowToastEvent({
                        title: "Congratulations, Sign-up Successfully!",
                        variant: "success"
                    }));
            
                    
                    // window.location.href = "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/";

                })
                .catch(error => {
                    // Handle errors here
                    console.error(error);
                });

                this.dispatchEvent(new ShowToastEvent({
                    title: "Congralations, Sign-up Successfully!",
                    // message: "Check Your Mail to Set Password",
                    variant: "success"
                }));

                // this[NavigationMixin.Navigate]({
                //     type: "standard__webPage",
                //     attributes: {
                //        url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/login"
                //     }
                // });
    
    

                
    
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
