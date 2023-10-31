import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class eventRegistrationScreen extends LightningElement {
    handleSuccess(){
        this.dispatchEvent(new ShowToastEvent({
            title: "Congo🍾",
            message: "Registration Done!!!!",
            variant: "success"
            
        }));
        //To make the field null
        this.template.querySelectorAll('lightning-input-field').forEach(field => {
            field.value = null;
         });
    }

    @track ShowRegisterScreen = true;
    @track showEventScreen = false;
    handleCancel(){
        this.ShowRegisterScreen = false;
        this.showEventScreen = true;
    }
 }
