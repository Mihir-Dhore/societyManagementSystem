import { LightningElement, api, track,wire } from 'lwc';
import selectSociety from '@salesforce/apex/SMSsearchEvent.selectSociety'
export default class SocietyModalScreen extends LightningElement {
    @track showSocietyModal = true;

    @api eventId;
    @wire(selectSociety, {eventId: '$eventId'})
    wiredSociety;
     
    handleSocietyChange(event){
        this.eventId = event.target.value;
        console.log(event.target.value);
     }
 
    //Save Button
    handleSave(){
        if(this.wiredSociety.data){
            console.log(this.wiredSociety.data);
            
            this.showSocietyModal=false;

        }else if(this.wiredSociety.error){
            console.error(this.wiredSociety.error);
        }
    }

}