import { LightningElement,track, wire} from 'lwc';
import findEvents from '@salesforce/apex/SMSsearchEvent.selectSociety';
import registerForEvent from '@salesforce/apex/SMSsearchEvent.registerForEvent';

 

export default class EventScreen extends LightningElement {
 
     @track events = [];
     @track eventId;
     @track error;
     @track errorMessage = '';
  

    //for search
    @track searchKey = ''; 
    handlekeyEvent(event) {
        this.searchKey = event.target.value; // Update the searchKey property

        // Call the search function
        this.searchEvents();
    }

  
    // connectedCallback(){
    //     this.searchEvents();
    // }
    @track modalScreen = true;
    handlePassId(event){
        this.eventId = event.detail;
        console.log('HandlePAssId'+this.eventId)
        this.searchEvents();
     }

     searchEvents() {
        findEvents({ eventId: this.eventId })
        //For Registration required button
            .then((result) => {
                console.log("Event Name"+ result.Name);
                console.log("Organizer Name"+ result.Contact__c);
                console.log("Event Name"+ result.Name);

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
    
 

    //Register Modal
    @track isModalOpen =false;
    @track ShowEventScreen = true;

    //For register here button
    handleRegister(event){
        this.isModalOpen = true;
        this.eventId = event.currentTarget.dataset.eventId;
        console.log('EventID'+ this.eventId)

     }

         //For checkbox
         @track checkboxValue = false;
         @track checkboxError = false;
     
         handleCheckboxChange(event) {
             this.checkboxValue = event.target.checked;
             this.checkboxError = false; 
         }

    //For YES button
    submitYesDetails()
    {
        if(this.checkboxValue == false)
        {
            this.checkboxError = true;
            console.log('Checkbox not selected');

        } else{
            console.log('Checkbox selected');
            registerForEvent({eventId: this.eventId })
            .then(result => {
                console.log('Registration successful:'+ result);
                this.isModalOpen = false;

            })
            .catch(error => {
                
                this.error = error;
                console.error('Error registering for the event:', error.body.message);
            });
        }     
    }

    closeModal(){
        // this.ShowEventScreen = false;
        this.isModalOpen =false;
    }
    //For registerFamily
    @track showRegisteFamily = false;
    registerFamily(){
        this.showRegisteFamily = true;
        this.ShowEventScreen = false;
    }
}