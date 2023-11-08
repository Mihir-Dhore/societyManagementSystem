import { LightningElement,track, api,wire} from 'lwc';
// import findEvents from '@salesforce/apex/SMSsearchEvent.selectSociety';
import registerForEvent from '@salesforce/apex/SMSsearchEvent.registerForEvent';
 
import checkRegistration from '@salesforce/apex/SMSsearchEvent.checkRegistration';
 

import CheckCurrentUserSociety from '@salesforce/apex/SMSsearchEvent.isCurrentUserSocietyEmpty';
import SearchEventsForAlreadyRagstered from '@salesforce/apex/SMSsearchEvent.SearchEventsForAlreadyRagstered';
import UpdateSocietyOnAccount from '@salesforce/apex/SMSsearchEvent.UpdateAccountSociety';
 
export default class EventScreen extends LightningElement {
 
     @track events = [];
     @track eventId;
     @track error;
     @track errorMessage = '';
  


     //************************************For Society Modal-START*************************************************

     @track showSocietyModal = true;
     @track ShowEventScreen = false;

     connectedCallback(){
        this.CheckCurrentUserSocietyField();
     }

     @track SocietyExistContact;

     CheckCurrentUserSocietyField(){
         CheckCurrentUserSociety()
         .then((result)=>{
             this.SocietyExistContact=result;
             console.log(this.SocietyExistContact);
             this.SocietyAlreadyexist();

             this.showSocietyModal = false;
             this.ShowEventScreen = true;
         }).catch((error)=>{
            // this.showSocietyModal  = true;
          });
     }

     handleSave(){
        let inputField = this.template.querySelector('[data-id="society"]');
        this.SocietyExistContact = inputField.value;
        console.log(this.SocietyExistContact);
        this.UpdateSocietyOnContact();
        this.SocietyAlreadyexist();
       
        this.showSocietyModal = false;
        // this.ShowEventScreen = true;
     }

     SocietyAlreadyexist(){
         SearchEventsForAlreadyRagstered({AlreadyRagistered:this.SocietyExistContact})
         .then((result)=>{
             let arr = JSON.parse(JSON.stringify(result));
             arr.forEach((item)=>{
                 if(item.Eligibility__c=='Registration Required'){
                    item["Registrationrequired"] = true;
                 }else{
                    item["Registrationrequired"] = false;
                 }
             });
             this.events = arr;
         }).catch((error)={

         });
         
     }

    async UpdateSocietyOnContact(){
        await UpdateSocietyOnAccount({SocietyId: this.SocietyExistContact})
        .then((result)=>{

        }).catch((error)=>{

        });
     }
 
     //************************************For Society Modal-END*************************************************

    //for search
    @track searchKey = ''; 
    handlekeyEvent(event) {
        this.searchKey = event.target.value; // Update the searchKey property

        // Call the search function
        this.searchEvents();
    }

  
    @track modalScreen = true;
 
     //to close Modal
     handleCloseModal(){
        this.isModalOpen = false;
     }
 

    //Register Modal
    @track isModalOpen =false;
    @track ShowEventScreen = true;

 
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