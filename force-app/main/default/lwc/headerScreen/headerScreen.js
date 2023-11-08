import { LightningElement, api, track,wire } from 'lwc';
import myProfileRelatedContact from '@salesforce/apex/SMSsearchEvent.myProfileRelatedContact';

export default class HeaderScreen extends LightningElement {

    @api eventId;
    @track contacts;
 
    @wire(myProfileRelatedContact,{eventId: '$eventId'})
    wiredprofileContacts({data,error})
    {
        if(data){
            this.contacts = data;
            console.log('Contact',this.contacts)
        }else if(error){
           alert('Errror!')
        }
    }

    
    @track showEventScreen = false;
    handleEventClick(){
        this.showEventScreen = true;

    }

    @track myProfile = false;
    handlemyProfileClick(){
        this.myProfile = true;

    }

}