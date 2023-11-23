import { LightningElement,track, api,wire} from 'lwc';
// import findEvents from '@salesforce/apex/SMSsearchEvent.selectSociety';
import registerForEvent from '@salesforce/apex/SMSsearchEvent.registerForEvent';
// import checkRegistration from '@salesforce/apex/SMSsearchEvent.checkRegistration';
 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CheckCurrentUserSociety from '@salesforce/apex/SMSsearchEvent.isCurrentUserSocietyEmpty';
import SearchEventsForAlreadyRagstered from '@salesforce/apex/SMSsearchEvent.SearchEventsForAlreadyRagstered';
import UpdateSocietyOnAccount from '@salesforce/apex/SMSsearchEvent.UpdateAccountSociety';
import checkUserRegistrationForEvent from '@salesforce/apex/SMSsearchEvent.checkUserRegistrationForEvent';

export default class EventScreen extends LightningElement {
 
     @track events = [];
     @track eventId;
     @track error;
     @track errorMessage = '';
  


     //************************************For Society Modal-START*************************************************

     @track showSocietyModal = false;
     @track ShowEventScreen = true;

     connectedCallback(){
        this.CheckCurrentUserSocietyField();
     }

     @track SocietyExistContact;

     CheckCurrentUserSocietyField(){
         CheckCurrentUserSociety()
         .then((result)=>{
            if(result ==='False')
            {
                this.showSocietyModal  = true;

            }else{
                this.SocietyExistContact=result;
                console.log(this.SocietyExistContact);
                this.SocietyAlreadyexist();
   
                this.showSocietyModal = false;
            }

         }).catch((error)=>{
          });
     }

     handleSave(){
        let inputField = this.template.querySelector('[data-id="society"]');
        this.SocietyExistContact = inputField.value;
        console.log(this.SocietyExistContact);
        this.UpdateSocietyOnContact();
        this.SocietyAlreadyexist();
       
        this.showSocietyModal = false;
     }
     @track organizerName;

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

             //To Show the Organizer Name Instead of Id
             this.events = result.forEach(organizer=>{
                this.organizerName = organizer.Contact__r.Name;

            })
         }).catch(error=>{

         });
         
     }

    async UpdateSocietyOnContact(){
        await UpdateSocietyOnAccount({SocietyId: this.SocietyExistContact})
        .then((result)=>{

        }).catch((error)=>{

        });
     }
 
     //************************************For Society Modal-END*************************************************


          //************************************For Registration Modal-START*************************************************

          @track isModalOpen = false;

          handleRegister(event){
            this.eventId = event.currentTarget.dataset.eventId;
            checkUserRegistrationForEvent({eventId:this.eventId})
            .then((result)=>{
                if(result=='Already Registered'){
                    this.dispatchEvent(new ShowToastEvent({
                        title: "Already Registered",
                        variant: "warning"
                    }));
                }else{
                    this.isModalOpen = true;

                }
            })
           }
           
          closeModal(){
            this.isModalOpen = false;
          }
        //For YES button
            submitYesDetails()
            {
                console.log("eventId",this.eventId)
                if(this.checkboxValue == false)
                {
                    this.checkboxError = true;
                    console.log('Checkbox not selected');

                } else{
                    console.log('Checkbox selected');

                    registerForEvent({eventId: this.eventId })
                    .then(result => {
                        alert(result)
                        console.log('result', result);
                        this.isModalOpen = false;
                    })
                    .catch(error => {
                        this.error = error;
                        console.error('Error registering for the event:', error.body.message);
                    });
                }     
            }


          //************************************For Registration Modal-END*************************************************

    //for search
    @track searchKey = ''; 
    handlekeyEvent(event) {
        this.searchKey = event.target.value; // Update the searchKey property

        // Call the search function
        this.searchEvents();
    }

  
    @track modalScreen = true;
 
     //to close Modal
  

    //Register Modal
     @track ShowEventScreen = true;

 
          //For checkbox
         @track checkboxValue = false;
         @track checkboxError = false;
     
         handleCheckboxChange(event) {
             this.checkboxValue = event.target.checked;
             this.checkboxError = false; 
         }

     //For registerFamily
    @track showRegisteFamily = false;
    registerFamily(){
        this.showRegisteFamily = true;
        this.ShowEventScreen = false;
    }
}