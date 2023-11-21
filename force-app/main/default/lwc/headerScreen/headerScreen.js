import { LightningElement, api, track,wire } from 'lwc';
import SMS from '@salesforce/resourceUrl/SMS';

export default class HeaderScreen extends LightningElement {

    SMS = SMS;
  
    
    @track showEventScreen = false;
    handleEventClick(){
        this.showEventScreen = true;

    }

    @track ShowMyProfile = false;
    handlemyProfileClick(){
        this.ShowMyProfile = true;
        this.showEventScreen = false;
    }

    @track showUtility = false;
    handleUtility(){
        this.showUtility = true;
    }

}