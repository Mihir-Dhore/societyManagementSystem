Parent To Child Relationship in LWC 
Scenario:- When User Select Society From the Lookup Input Field from the Modal then it should show the Related Events to that Society

Parent Component(SocietyModal Screen):
HTML:
```
<template>
  <template if:true={showSocietyModal}>
   <section role="dialog" tabindex="-1" aria-modal="true" aria-labelledby="modal-heading-01" class="slds-modal slds-fade-in-open">
        <div class="slds-modal__container">
          <button class="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
            <svg class="slds-button__icon slds-button__icon_large" aria-hidden="true">
              <use xlink:href="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
            </svg>
            <span class="slds-assistive-text">Cancel and close</span>
          </button>
          <div class="slds-modal__header">
            <h1 id="modal-heading-01" class="slds-modal__title slds-hyphenate">SELECT SOCIETY</h1>
          </div>
          <div class="slds-modal__content slds-p-around_medium" id="modal-content-id-1">
            <lightning-record-edit-form
            density="compact"
            object-api-name="Event__c"
            onsuccess={handleSocietySuccess}
           >
              <lightning-input-field field-name="Society__c" data-id="society" variant="standard">
              </lightning-input-field>
              <div class="slds-modal__footer">
                <button class="slds-button slds-button_neutral" aria-label="Cancel and close">Cancel</button>
                <button onclick={handleSave} class="slds-button slds-button_brand">Save</button>
              </div>
           </lightning-record-edit-form>
          </div>
        </div>
      </section>
      <div class="slds-backdrop slds-backdrop_open" role="presentation"></div> 
    </template>

//This child component, c-event-screen, is passed a property called storeEventId with the value of eventId. This allows data to be passed from the parent component to the child component.
    <template if:true={eventScreenParent}>
      <c-event-screen > storeEventId={eventId}</c-event-screen>
    </template>
</template>
```
JS:
```
    @api eventId;
     
    @track showSocietyModal = true;
    @track eventScreenParent = false;
    //Save Button
    handleSave(){
        this.showSocietyModal=false;

//It's used to select an HTML element from the current component's template. Specifically, it's looking for an element with a data-id attribute set to "society." 
        let inputField = this.template.querySelector('[data-id="society"]');
        this.eventId = inputField.value;
//This line dispatches a custom event using the dispatchEvent method. The custom event is named 'passid', and it carries a data payload in its detail property. The payload //is the value of this.eventId
        //Use to communicate between other LWC component

        this.dispatchEvent(new CustomEvent('passid', { detail: this.eventId }));
     }
```
Child Component(EventScreen):
HTML:
```
    <template if:true={modalScreen}>
          //onpassid={handlePassId} =>>>>>> event handler for the custom component
        <c-society-modal-screen onpassid={handlePassId}></c-society-modal-screen>
    </template>

```
JS:
```
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
```

LWC data table with EDIT, VIEW And DELETE Buttons
-->The Table Show the Information of Current Login Account's related Contact into the table 

HTML:-
```
HTML:-
<template>
    <lightning-card title="Profile" icon-name="standard:account">
        <template if:true={data}>
            <lightning-datatable key-field="Id" data={data} columns={columns} hide-checkbox-column="true"
                show-row-number-column="true" onrowaction={callRowAction}></lightning-datatable>
        </template>
        <template if:true={error}>
            {error}
        </template>
    </lightning-card>
</template>
```
JavaSript:-
```
import { LightningElement, wire,track } from 'lwc';
import GetRelatedContacts from '@salesforce/apex/SMSsearchEvent.GetRelatedContacts';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
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
 
    callRowAction(event) {
        const rowId = event.detail.row.Id; //Get RowId of particular Row from datatable
        const actionName = event.detail.action.name;  //Get actionName of particular Row from datatable
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
```
APEX Class
```
public without sharing class FetchRelatedContact {
    //For MyProfile --> List of related Contact
    @AuraEnabled(cacheable=true)
    public static List<Contact> GetRelatedContacts(){ 
        String currentUserName = UserInfo.getUserName();
        List<Account> getAccounts = [Select Id, Name, Email__c From Account Where Email__c=:currentUserName];
        List<Contact> getRelatedContacts = new List<Contact>();
        for(Account acc: getAccounts){
            List<Contact> addRelatedCon = [Select Id, Name, Phone, Email From Contact Where AccountId =: acc.Id];
            getRelatedContacts.addAll(addRelatedCon);
         }
        return getRelatedContacts;
    }
}
```
LWC Component to Add Contact From Guest User Side Manually
(First Fetch data or Show data on component the perform this activity.s
HTML:-

```
   <lightning-input label="First Name" value={firstName} onchange={handleFirstNameChange}></lightning-input>
                <lightning-input label="Last Name" value={lastName} onchange={handleLastNameChange}></lightning-input>
                <lightning-input label="Email" type="email" value={email} onchange={handleEmailChange}></lightning-input>
        

                <lightning-button
                label="Create Contact"
                title="Create a new Contact associated with the Account"
                onclick={handleCreateContact}
                variant="brand"
            ></lightning-button>
```
JavaScript:-
```
   @track fieldName = '';
     @track lastName = '';
     @track email = '';

     handleFirstNameChange(event){
        this.fieldName = event.target.value;
     }
     handleLastNameChange(event){
        this.lastName = event.target.value;
     }
     handleEmailChange(event){
        this.email = event.target.value;
     }
 
     handleCreateContact(){
        createContact({firstName:this.firstName, lastName:this.lastName, email:this.email})
        .then((result)=>{
            console.log('Contact Created Succesfully:', result);
            return refreshApex(this.wireResult); // To refresh current Page --> this.wireResult is variable where Wire data is.
         })
        .catch(error=>{
            console.error('Error Creating Contact: ', error);
        })
     }
```
Apex class:-
```
//To Add Family Member
    @AuraEnabled
    public static String createContact(String firstName,String lastName, String email){
        
        String currentUserName = UserInfo.getUserName();
        List<Account> getAccounts = [Select Id,Name, Email__c From Account Where Email__c =:currentUserName];
 
        if(getAccounts!=Null)
        {
               Contact newContact = new Contact();
               newContact.AccountId = getAccounts[0].Id;
                newContact.FirstName = firstName;
                newContact.LastName = lastName;
                newContact.Email = email;
           
               insert newContact;
               return 'Contact Added Succesfully';

        }
        return 'Error';
    }
```
Code for Stringify
```
                let arr = JSON.parse(JSON.stringify(result));
```

Code For Refresh Apex
```
import { refreshApex } from '@salesforce/apex';
return refreshApex(this.wireResult);
```
LWC Component to Delete Selected Record from the lwc-datatable after Clicking on 'Delete' Button.

APEX:
```
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<account>  getAccountList(){
        return [SELECT Id, Name,Phone,Industry FROM Account order by createddate desc LIMIT 5];
    }
}
```
Javascript:
```
import { LightningElement, wire, track } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';

import getLatestAccounts from '@salesforce/apex/AccountController.getAccountList';
const COLS = [
  { label: 'Name', fieldName: 'Name', type: 'text' },
  { label: 'Stage', fieldName: 'Phone', type: 'text' },
  { label: 'Amount', fieldName: 'Industry', type: 'text' }
];
export default class LwcRefreshApex extends LightningElement {
  cols = COLS;
  @track selectedRecord;
  @track accountList = [];
  @track error;
  @track wiredAccountList = [];

  @wire(getLatestAccounts) accList(result) {
    this.wiredAccountList = result;

    if (result.data) {
      this.accountList = result.data;
      this.error = undefined;
    } else if (result.error) {
      this.error = result.error;
      this.accountList = [];
    }
  }

  handelSelection(event) {
    if (event.detail.selectedRows.length > 0) {
      this.selectedRecord = event.detail.selectedRows[0].Id;
    }
  }
  deleteRecord() {
    deleteRecord(this.selectedRecord)
      .then(() => {
        refreshApex(this.wiredAccountList);
      })
      .catch(error => {
      })
  }
}

```
HTML:
```
<template>  
    <lightning-card title="Latest Five Accounts">  
      <lightning-button slot="actions" label="Delete Account" onclick={deleteRecord}></lightning-button>  
        <lightning-datatable  
        data={accountList} columns={cols} key-field="Id" 
        max-row-selection="1" onrowselection={handelSelection} >  
        </lightning-datatable>  
    </lightning-card>  
  </template>

```
Trigger to Solve RollUp Summary Field Work - trigger to count Number of Account From Custom Object
```
 trigger SMSUpdateNumberOfFlatsOnAccount on Account (after insert, after update, after delete) {
    Set<Id> societyIdsToUpdate = new Set<Id>();

    if (Trigger.isInsert || Trigger.isUpdate) {
        for (Account acc : Trigger.new) {
            societyIdsToUpdate.add(acc.Society__c);
        }
    } else if (Trigger.isDelete) {
        for (Account acc : Trigger.old) {
            societyIdsToUpdate.add(acc.Society__c);
        }
    }

    // Update Society records
    List<Society__c> societiesToUpdate = new List<Society__c>();

    for (Id societyId : societyIdsToUpdate) {
        Society__c society = [SELECT Id, Number_of_Flats__c, (SELECT Id FROM Accounts__r) FROM Society__c WHERE Id = :societyId LIMIT 1];

        society.Number_of_Flats__c = society.Accounts__r.size();
        societiesToUpdate.add(society);
    }

    update societiesToUpdate;
}

 ```
 Code to change the button label after changing the status to Unpaid to Paid--'Shortly when status change to 'Paid' the button is like 'Paid Already' and when the status is 'Unpaid' the button is like 'Mark As Paid'.

 Javascript
 ```
const columns = [
    { label: 'Amount', fieldName: 'Amount__c',initialWidth: 100 },
    { label: 'Society', fieldName: 'SocietyName',initialWidth: 150},
    { label: 'Status', fieldName: 'Status__c',initialWidth: 100},
    { label: 'Utility Provider', fieldName: 'UtilityProviderName',initialWidth: 150},
 
    {
        type: "button", label: 'Mark As Paid', initialWidth: 150, typeAttributes: {
            // label: 'Mark As Paid',
            label: { fieldName: 'buttonLabel' }, //Added dynamic label
            name: 'MarkAsPaid',
            title: 'MAP',
            disabled: false,
            // value: 'view',
            iconPosition: 'left',
            // iconName:'utility:preview',
            variant:'Brand'
        }
    }
    
];

export default class UtilityScreen extends LightningElement {

    @track utilityData;
    columns = columns;
    connectedCallback(){
        this.showUtilityDetails()
    }
    showUtilityDetails(){
        showUtilityDetails()

//In below map and ...Spread operator is for button functionality
        .then(result=>{
                this.utilityData = result.map(record =>({
                ...record, //used to include all existing fields of each record in the new object
                SocietyName: record.Society__r.Name,// To show society name instead of Id.
                UtilityProviderName: record.Utility_Provider__r.Name,
                buttonLabel: record.Status__c === 'Paid' ? 'Already Paid' : 'Mark As Paid'
            }));
            return refreshApex(this.utilityData);
        })
        .catch(error=>{
            console.log(error,'error');
        })
    
    }

```
To Show the Custom Field Name Instead Of Id.

HTML:
```
<p><b>Organizer:</b> {organizerName}</p>

```
Javascript:
```
     @track organizerName;
//Add Below code where the data is fetch basically in Function where data is fetched & events is variable which iterate over the data in HTML

             this.events = result.forEach(organizer=>{
                this.organizerName = organizer.Contact__r.Name;

            })

```
To Show the Custom Field Name Instead Of Id in Lightning Data Table.

Javascript:
```
const columns = [
     { label: 'Society', fieldName: 'SocietyName'},
 ];
export default class UtilityScreen extends LightningElement {
@track utilityData;
//Add where the data is fetched
    showUtilityDetails(){
        showUtilityDetails()
        .then(result=>{

              this.utilityData = result.map(record =>({
                ...record, //used to include all existing fields of each record in the new object
                SocietyName: record.Society__r.Name,// To show society name instead of Id.
 

```
Code to Add the Contact For Current Login User Account Dynamically(To Add Family Member Functionality)
APEX CLASS:-
```
    @AuraEnabled
    public static String createContact(String firstName,String lastName, String email, String phone){
        
        String currentUserName = UserInfo.getUserName();
        List<Account> getAccounts = [Select Id,Name, Email__c From Account Where Email__c =:currentUserName];
 
        if(getAccounts!=Null)
        {
               Contact newContact = new Contact();
               newContact.AccountId = getAccounts[0].Id;
                newContact.FirstName = firstName;
                newContact.LastName = lastName;
                newContact.Email = email;
                newContact.Phone = phone;
           
               insert newContact;
               return 'Contact Added Succesfully';

        }
        return 'Error';
    }
```
Javascript:
```
     handleCreateContact(){
        createContact({firstName:this.firstName, lastName:this.lastName, email:this.email,phone:this.phone})
        .then((result)=>{

            this.dispatchEvent(new ShowToastEvent({
                title: "Family Member Added Successfully",
                 variant: "success"
            }));
            this.showForm = false;

            console.log('Contact Created Succesfully:', result);
            return refreshApex(this.wireResult);
         })
        .catch(error=>{
            console.error('Error Creating Contact: ', error);
        })
     }

```
Update Functionality:
APEX:
```
    //Update the Status Value Of Utility Invoice as After Click on 'Mark as Lead'.
@AuraEnabled
public static String changeUtilityStatus() {
    String currentUserName = UserInfo.getUserName();

     List<Account> accList = [SELECT Id, Name, Email__c FROM Account WHERE Email__c = :currentUserName];

     List<Utility_Invoice__c> utiList = [SELECT Id, Name, Account__c, Amount__c, Invoice_Date__c, 
                                        Status__c,Utility_Provider__r.Name, Society__c, Society__r.Name 
                                        FROM Utility_Invoice__c WHERE Account__c = :accList[0].Id];

     Boolean unpaidFound = false;

     for (Utility_Invoice__c utility : utiList) {
         if (utility.Status__c == 'Unpaid' && utility.Status__c != null || utility.Amount__c != Null) {
             utility.Status__c = 'Paid';
             utility.Amount__c = 0;
            unpaidFound = true;
        }
    }

     update utiList;

     if (unpaidFound) {
        return 'Update Successfully';
    } else {
        return 'No Unpaid Invoices Found';
    }
}

```

