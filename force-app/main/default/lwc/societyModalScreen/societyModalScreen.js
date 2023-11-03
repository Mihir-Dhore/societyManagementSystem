import { LightningElement, api, track,wire } from 'lwc';
export default class SocietyModalScreen extends LightningElement {

    @api eventId;
     
    @track showSocietyModal = true;
    @track eventScreenParent = false;
    //Save Button
    handleSave(){
        this.showSocietyModal=false;

        let inputField = this.template.querySelector('[data-id="society"]');
        this.eventId = inputField.value;   
        //Use to communicate between other LWC component
        this.dispatchEvent(new CustomEvent('passid', { detail: this.eventId }));

     }

}