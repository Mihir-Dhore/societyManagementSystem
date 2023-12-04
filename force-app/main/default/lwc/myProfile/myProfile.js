import { LightningElement, api,wire,track } from 'lwc';
import GetRelatedContacts from '@salesforce/apex/SMSsearchEvent.GetRelatedContacts';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import createContact from '@salesforce/apex/SMSsearchEvent.createContact';
import showAccount from '@salesforce/apex/SMSsearchEvent.showAccountDetails';
import deleteRelatedContactOnUtility from '@salesforce/apex/SMSsearchEvent.deleteRelatedContactOnUtility';
import showVisitors from '@salesforce/apex/SMSsearchEvent.showVisitors';

//for visitors
const cols = [
    { label: 'Name', fieldName: 'Name',initialWidth: 120 },
    { label: 'Address', fieldName: 'Address__c',initialWidth: 180 },
    { label: 'Date and Time', fieldName: 'Date_and_Time__c',initialWidth: 120},
    { label: 'Flat', fieldName: 'flatName',initialWidth: 120 }
];
const columns = [
    { label: 'Name', fieldName: 'Name',initialWidth: 120 },
    { label: 'Phone', fieldName: 'Phone',initialWidth: 120 },
    { label: 'Email', fieldName: 'Email',initialWidth: 160 },
    { label: 'Approval Status', fieldName: 'Approval_Status__c',initialWidth: 120 },
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
          connectedCallback(){
           this.loadAccountDetails();
          }

          @track accountData;


    loadAccountDetails() {
        showAccount()
            .then(result => {
                let arr = JSON.parse(JSON.stringify(result));
                console.log('Result is here',arr);
                this.accountData =  arr;
            })
            .catch(error => {
                console.log('Error happend', error);
            });
    }
          //To show AccountInfo-End

     
    @track showForm = false;
    handleAddFamilyMemberClick(){
        this.showForm = true;
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
     handleCreateContact() {
        let isValid = true;
    
        this.template.querySelectorAll("lightning-input").forEach(item => {
            let fieldValue = item.value;
            let fieldLabel = item.label;
            let fieldError = 'Please Enter the';
    
            if (!fieldValue) {
                isValid = false;
                item.setCustomValidity(fieldError + " " + fieldLabel);
            } else {
                item.setCustomValidity("");
            }
            item.reportValidity();   
        });
    
        if (!isValid) {
            return;
        }
    
        createContact({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            phone: this.phone
        })
        .then(result => {
            this.dispatchEvent(new ShowToastEvent({
                title: "Family Member Added Successfully",
                variant: "success"
            }));
            this.showForm = false;
    
            console.log('Contact Created Successfully:', result);
            return refreshApex(this.wireResult);
        })
        .catch(error => {
            console.error('Error Creating Contact: ', error.body.message);
        });
    }
    
          //****************************For Add family member -END****************************


   //****************************For EDIT,VIEW and DELETE Buttons -Start****************************

    callRowAction(event) {
        const rowId = event.detail.row.Id;
        console.log('RowId',rowId);
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(rowId, 'edit');
        } else if (actionName === 'Delete') {
            deleteRelatedContactOnUtility({contactId:rowId})
            .then(result => {
                this.dispatchEvent(new ShowToastEvent({
                    message: "Record deleted Successfully",
                    variant: "success"
                }));
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
            });
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

    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
    
   //****************************For EDIT,VIEW and DELETE Buttons -End****************************


   //Visitors
   cols=cols;
   @track visitorsData;
   @track showVisitorsModal = false;

   handleVisitorsClick(){
    this.showVisitorsModal = true;
    showVisitors()
    .then(result=>{
       this.visitorsData =result.map(record=>({
        ...record,
        flatName: record.Account__r.Name
       })); 
    }).catch(error=>{
        console.log(error);
    })
   }

   onCancelVisitors(){
    this.showVisitorsModal = false;
   }
}