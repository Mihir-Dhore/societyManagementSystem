import { LightningElement,track, api,wire} from 'lwc';
// import findEvents from '@salesforce/apex/SMSsearchEvent.selectSociety';
import registerForEvent from '@salesforce/apex/SMSsearchEvent.registerForEvent';
// import checkRegistration from '@salesforce/apex/SMSsearchEvent.checkRegistration';
import { NavigationMixin } from 'lightning/navigation';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CheckCurrentUserSociety from '@salesforce/apex/SMSsearchEvent.isCurrentUserSocietyEmpty';
import SearchEventsForAlreadyRagstered from '@salesforce/apex/SMSsearchEvent.SearchEventsForAlreadyRagstered';
import UpdateSocietyOnAccount from '@salesforce/apex/SMSsearchEvent.UpdateAccountSociety';
// import checkUserRegistrationForEvent from '@salesforce/apex/SMSsearchEvent.checkUserRegistrationForEvent';
import GetRelatedContacts from '@salesforce/apex/SMSsearchEvent.GetRelatedContacts';
// import getFamilyMemberInRegiScreen from '@salesforce/apex/SMSsearchEvent.getFamilyMemberInRegiScreen';

const COLS = [
    {label: 'Name',fieldName:'Name'},
];
export default class EventScreen extends NavigationMixin(LightningElement) {
 
     @track events = [];
     @track eventId;
     @track error;
     @track errorMessage = '';
     @track societyName;

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
                this.societyName = item.Society__r.Name;
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

          cols = COLS;
          @track contactdata;
          handleRegister(event){
            this.getRelatedContact();
            this.eventId = event.currentTarget.dataset.eventId;
            // getFamilyMemberInRegiScreen({eventId:this.eventId})
            // .then((result)=>{
            //     console.log('re',result);

            //     this.contactdata = result;
            //     console.log('fdds',this.contactdata);

               this.isModalOpen = true;

                // if(!this.contactdata){
                //     this.dispatchEvent(new ShowToastEvent({
                //         title: "Already Registered",
                //         variant: "warning"
                //     }));
                // }else{
                //     this.isModalOpen = true;
                //     const arr = JSON.stringify(result);
                //     console.log(arr,'result');

                // }
            // })
           }


           getRelatedContact(){
            GetRelatedContacts()
                .then(result=>{
                    this.contactdata = result;
                    console.log('result',result);
                }).catch(error=>{
                    console.log(error);
                })
            
           }
           
          closeModal(){
            this.isModalOpen = false;
          }
        //For YES button

        @track selectedRows;
         @track selectedRowsId;

        handleRowSelection(event) {
            const selectedRows = event.detail.selectedRows;
            for (let i = 0; i < selectedRows.length; i++){
                // alert("You selected: " + selectedRows[i].Id);
                this.selectedRowsId = selectedRows[i].Id
                 
            }
        }
            submitYesDetails()
            {
                    console.log('eventId',this.eventId);
                    console.log('selectedRowsId',this.selectedRowsId);

                    registerForEvent({eventId: this.eventId,selectedRowsId:this.selectedRowsId})
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
            // }


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




    //To click on Society Name
    handleSocietyClick(){
        this[NavigationMixin.Navigate]({
            type: "standard__webPage",
            attributes: {
               url: "https://thecodingstudio2-dev-ed.develop.my.site.com/sms/s/society-info-screen"
            }
        });
    }
}