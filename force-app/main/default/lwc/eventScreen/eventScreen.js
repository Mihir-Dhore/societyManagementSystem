import { LightningElement,track, wire} from 'lwc';
import findEvents from '@salesforce/apex/SMSsearchEvent.findEvents';
export default class EventScreen extends LightningElement {
 
     @track events = [];
 
 
    //for search
    @track searchKey = ''; 
    handlekeyEvent(event) {
        this.searchKey = event.target.value; // Update the searchKey property

        // Call the search function
        this.searchEvents();
    }

  
    connectedCallback(){
        this.searchEvents();
    }

    searchEvents() {
        findEvents({ searchKey: this.searchKey })
        //For Registration required button
            .then((result) => {

                let arr = JSON.parse(JSON.stringify(result));
                arr.forEach((item) => {
                      console.log(item.Eligibility__c);
                    if (item.Eligibility__c == 'Registration Required') {
                        item["Registrationrequired"] = true;
                     } else {
                          item["Registrationrequired"] = false;
                    }
                });   
                this.events = arr;

            })
            .catch((error) => {
                this.events = error;
            });
    }
    
 

    //Register
    @track ShowRegisterScreen =false;
    @track ShowEventScreen = true;

    handleRegister(){
        this.ShowRegisterScreen = true;
        this.ShowEventScreen = false;
    }
}