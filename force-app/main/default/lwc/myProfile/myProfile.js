import { LightningElement, api,wire,track } from 'lwc';
import GetRelatedContacts from '@salesforce/apex/SMSsearchEvent.GetRelatedContacts';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

import createContact from '@salesforce/apex/SMSsearchEvent.createContact';
import showAccount from '@salesforce/apex/SMSsearchEvent.showAccountDetails';


 

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Email', fieldName: 'Email' },
    {
        type: "button", label: 'View', initialWidth: 100, typeAttributes: {
            label: 'View',
            name: 'View',
            title: 'View',
            disabled: false,
            value: 'view',
            iconPosition: 'left',
            iconName:'utility:preview',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Edit', initialWidth: 100, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconPosition: 'left',
            iconName:'utility:edit',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Delete', initialWidth: 110, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'destructive'
        }
    }
];

export default class MyProfile extends NavigationMixin (LightningElement) {

    @track data;
    @track wireResult;
    @track error;
    columns = columns;

     @wire(GetRelatedContacts)
    wiredContacts(result){
        this.wireResult = result;
         if(result.data){
            this.data = result.data;
        }else if(result.error){
            this.error = result.error;
        }
    }

          //****************************For Add family member -START****************************

          //To show AccountInfo - Start
          connectdCallback(){
           this.loadAccountDetails();
          }

          @track accname;
    @track accountDat=[];


    loadAccountDetails() {
        showAccount()
            .then(result => {
                this.accountData = result.forEach(acc => {
     this.accname =acc.Name;                 
                });
                console.log('sdskjsjkd',this.accountData)
            })
            .catch(error => {
                console.error('Error', error);
            });
    }
          //To show AccountInfo-End

     
    @track showForm = false;
    handleAddFamilyMemberClick(){
        this.showForm = true;
     }
   
      handleCreateContact(){
        this.dispatchEvent(new ShowToastEvent({
            title: "Family Member Added Successfully",
             variant: "success"
        }));
        this.showForm = false;
      }
      handleCancel(){
        this.showForm = false;
      }

      @track firstName = '';
     @track lastName = '';
     @track email = '';
     @track phone = '';
      handleFirstNameChange(event){
        this.firstName = event.target.value;
     }
     handleLastNameChange(event){
        this.lastName = event.target.value;
     }
     handleEmailChange(event){
        this.email = event.target.value;
     }
     handlePhoneChange(event){
        this.phone = event.target.value;
     }
     handleCreateContact(){
        createContact({firstName:this.firstName, lastName:this.lastName, email:this.email,phone:this.phone})
        .then((result)=>{
            console.log('Contact Created Succesfully:', result);
            return refreshApex(this.wireResult);
         })
        .catch(error=>{
            console.error('Error Creating Contact: ', error);
        })
     }

          //****************************For Add family member -END****************************

    callRowAction(event) {
        const rowId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(rowId, 'edit');
        } else if (actionName === 'Delete') {
            this.handleDeleteRow(rowId);
        } else if (actionName === 'View') {
            this.handleAction(rowId, 'view');
        }
    }

    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: mode
            }
        })
    }

    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
            .then(result => {
                this.showToast('Success!!', 'Record deleted successfully!!', 'success', 'dismissable');
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
            });
    }

    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
    

}