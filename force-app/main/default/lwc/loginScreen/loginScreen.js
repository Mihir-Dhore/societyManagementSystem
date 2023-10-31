import { LightningElement, track } from 'lwc';
// import validateLogin from '@salesforce/apex/SMSSignUpLogin.validateLogin'
import { NavigationMixin } from 'lightning/navigation';
export default class LoginScreen extends NavigationMixin (LightningElement)  {
    email = '';
    password = '';
     handleEmailChange(event)
    {
        this.email = event.target.value;
    }
    handlePasswordChange(event){
        this.password = event.target.value;
    }
    @track eventScreen = false;
    handleLogin(event)
    {
        console.log("Username",this.email);
        console.log("Password",this.password);
        validateLogin({ email: this.email, password: this.password })
        .then(result => {
            if (result.startsWith('Success')) {
                console.log('Login successful');
                this.eventScreen = true;
                
            } else {
                 console.error('Login error: ' + result);
            }
        })
        .catch(error => {
             console.error('Apex call error: ' + error);
        });

    }

     handleLoginHereClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/login/SelfRegister"
            }
        });
     }
     handleLogin(event)
     {
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/"
            }
        });
     }
}