import { LightningElement, api, track } from 'lwc';
export default class SocietyModalScreen extends LightningElement {


    @api eventId;
     
    @track showSocietyModal = true;
    @track eventScreenParent = false;
    //Save Button
    @track disableBtn = true;
    @track field1;

    handleSocietyFieldChange(event){
        this.field1 = event.target.value;
        this.disableBtn = !this.field1; // I will Disable the button if field1 is falsy (empty or null)

    }
    handleSave(){

        let inputField = this.template.querySelector('[data-id="society"]');
        this.eventId = inputField.value;  

        this.dispatchEvent(new CustomEvent('closemodal'));

        //Use to communicate between other LWC component
        this.dispatchEvent(new CustomEvent('passid', { detail: this.eventId }));
        this.showSocietyModal=false;
        // this.eventScreenParent = true;


     }

}