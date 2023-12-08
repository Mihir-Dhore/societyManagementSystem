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
              //  societyName: record.Society__r ? record.Society__r.Name : '', use this line or above

 

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
Trigger to Send Email once the User registered for the Event(after insert)
```
trigger SMSEventRegistration on Event_Registration__c (after insert) {
    List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();

   for (Event_Registration__c er : Trigger.new) {
       if(er.Email__c != null){
       Messaging.SingleEmailMessage emailMsg = new Messaging.SingleEmailMessage();
       String[] toAddresses = new String[] { er.Email__c };
       emailMsg.setToAddresses(toAddresses);

       emailMsg.setSubject('Register Successfully!!!');

       String emailBody = 'Dear ' + er.Resident__c + ',<br/><br/>' +
           'You Have Successfully Registered for the Event.<br/>'   +          
            'Thank you!!!';

       emailMsg.setHtmlBody(emailBody);
       emailList.add(emailMsg);
       }
   }
   Messaging.sendEmail(emailList);

}
```
Trigger to Send Email once the User add the Maintainance Request (after insert)
```
trigger SMSMaintainceReqSendMail on Maintenance_Request__c (after insert) {
   
    List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();

   for (Maintenance_Request__c request : Trigger.New) {
       
       String subject = 'New Maintenance Request Created';
       String body = 'A new maintenance request has been created:\n\n';
       body += 'Request Details:\n';
       body += 'Description: ' + request.Description__c + '\n';
       body += 'Date: ' + System.Today();
     
       String currentUserEmail = UserInfo.getUserEmail();

       Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
       email.setSubject(subject);
       email.setPlainTextBody(body);
       email.setToAddresses(new String[]{currentUserEmail}); 

       emailMessages.add(email);
   }

   Messaging.sendEmail(emailMessages);

}
```
Code to Disable Normal Button
HTML:
```
    <lightning-input 
      type="text"
      label="Enter some text"
      onchange={handleInput}
      value={field1}
    ></lightning-input>

    <lightning-button 
      variant="brand"
      label="Button Label" 
      onclick={handleClick} 
      disabled={disableBtn}
    ></lightning-button>
```
JS:
```
    @track field1;
    @track disableBtn;
    handleInput(event){
        this.field1 = event.target.value;
        this.disableBtn = !this.field1;
    }

```
Code to Disable lwc Datatable Button
JS:
```
{
        type: "button", label: 'Mark As Paid', initialWidth: 150, typeAttributes: {
            // label: 'Mark As Paid',
            // label: { fieldName: 'buttonLabel' }, //Added dynamic label
            label: 'Mark As Read',
            name: 'MarkAsPaid',
            title: 'MAP',
            disabled: {fieldName:'MarkAsPaid'}, //Only this line for button
            // value: 'view',
            iconPosition: 'left',
            // iconName:'utility:preview',
            variant:'Brand'
        }


showUtilityDetails(event){
        showUtilityDetails()
        .then(result=>{
         
        this.utilityData = result.map(record=>({
            ...record,
            accountName: record.Account__r ? record.Account__r.Name : '',
            utilityProvider: record.Utility_Provider__r ? record.Utility_Provider__r.Name : '',
            MarkAsPaid: record.Status__c ==='Paid', //this line for button

        })); 
```
Header Code LWC:
HTML:
```
 <div class="mainn">
    <nav>
        <div class="stylish-header">
            <a class="links logo" href="#">SMS</a>
            <div class="rightSection">
                <div class="menu-toggle" onclick={toggleMenu}>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    <div class="bar"></div>
                    
                </div>
                <div class="menu-items">
                    <h1 class="menu-item" onclick={handleEventClick} data-type="event">Event</h1>
                    <h1 class="menu-item" onclick={handleUtility} data-type="utilities">Utilities</h1>
                    <h1 class="menu-item" onclick={handlemyMaintainanceReqClick} data-type="maintainanceReq">Maintenance Request</h1>
                    <h1 class="menu-item" onclick={handlefeedbackClick} data-type="feedback">Feedback</h1>
                    <h1 class="menu-item" onclick={handlemyProfileClick} data-type="myprofile">MyProfile</h1>
                </div>
            </div>
        </div>
    </nav>
</div>
```
CSS:
```
* {
   box-sizing: border-box;
}

nav {
   overflow: hidden;
   background-color: #f4f6f9;
   padding: 10px;
}

.menu-item {
   font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
   font-weight: bold;
   float: left;
   color: black;
   text-align: center;
   padding: 12px;
   text-decoration: none;
   font-size: 15px;
   line-height: 25px;
   border-radius: 4px;
}

nav .logo {
   font-size: 25px;
   font-weight: bold;
}

nav .menu-item.selected {
   background-color: rgb(214, 238, 77);
   color: rgb(42, 10, 94);
}

nav .menu-item:hover {
   background-color: rgb(214, 238, 77);
   color: rgb(42, 10, 94);
}

nav .selected {
   background-color: dodgerblue;
   color: white;
}

.rightSection {
   float: right;
}

.menu-toggle {
   display: none;
   cursor: pointer;
   padding: 10px;
}

.menu-toggle .bar {
   height: 3px;
   width: 25px;
   background-color: #333;
   margin: 5px 0;
}

.menu-items {
   display: flex;
   align-items: center;
   z-index: 1;/* For Mobile View */
}

/* For Mobile View */
@media screen and (max-width: 600px) {
   .menu-item {
       display: block;
   }

   .menu-toggle {
       display: block;
   }

   .menu-items {
       flex-direction: column;
       position: absolute;
       top: 61px;
       left: 0;
       width: 100%;
       background-color: #f4f6f9;
       display: none;
   }

   .menu-items.show {
       display: flex;
   }
}
/* For Mobile View */

.mainn {
   background-color: #f0f0f0;
   border: 1px solid #e7cece;
   border-radius: 4px;
   padding: 5px;
}
```
JS:
```
    toggleMenu(event) {
        console.log('toggleMenu called');
        const menuItems = this.template.querySelector('.menu-items');
        if (menuItems) {
            menuItems.classList.toggle('show');
        }
    }

```
To Make the Field Compulsory or to add Field Error in LWC:
Javascript:
```
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
            item.reportValidity();  // Corrected method name
        });
    
        if (!isValid) {
            return;
        }
```
Query that joins the Contact and Account objects SOQL Query: it shows the both Account and Contact Data.
```
SELECT Id, Name, (SELECT Name, Phone FROM Contacts WHERE AccountId != null AND Phone != null)
FROM Account WHERE Type = 'Prospect' AND (Phone LIKE '3%' OR Phone LIKE '4%' OR Phone LIKE '7%') AND OwnerId = '0055j000008O8CGAA0'
```
Fetch Weather Data From API
Javascript:
```
//To fetch the api need to add the 'Trusted URL' in to the org from set and also need to add into 'CORS(Optional)'
    @track result;

    @track searchValue;
    handleSearchChange(event){
        this.searchValue = event.target.value;
     }

    handleFetch() {
      console.log('enter into data');
      let endPoint = `https://api.weatherapi.com/v1/current.json?key=6388b321ff7a4f239de125943230612&q=${this.searchValue}`;
      console.log('endpoint',endPoint)
      fetch(endPoint, {
        method: "GET"
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('data',data)
        this.result = data;
        console.log('repos',this.result);
       })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    }

```
HTML:
```
<!-- API -->
<template if:true={result}>
  <h1>Data is here</h1>
  <div style="display: flex; flex-wrap: wrap;">
       <p>City Name: {result.location.name} <br></p>
       <p>Temp in celcius: {result.current.temp_c}</p><br>
       <p>Temp in farade: {result.current.temp_f}</p>

   </div>
</template>

```
Salesforce Integration: Integrate with one or more another org
APEX:
```
@RestResource(urlMapping='/Cases/*')
global with sharing class APICall {
    @HttpGet
    global static List<Case> getCaseById() {
         List<Case> result =  [SELECT CaseNumber,Subject,Status,Origin,Priority
                        FROM Case Limit 10];
        return result;
    }
    @HttpPost
    global static ID createCase(String subject, String status,
        String origin, String priority) {
        Case thisCase = new Case(
            Subject=subject,
            Status=status,
            Origin=origin,
            Priority=priority);
        insert thisCase;
        return thisCase.Id;
    }   
    @HttpDelete
    global static void deleteCase() {
        RestRequest request = RestContext.request;
        String caseId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
        Case thisCase = [SELECT Id FROM Case WHERE Id = :caseId];
        delete thisCase;
    }     
    @HttpPut
    global static ID upsertCase(String subject, String status,
        String origin, String priority, String id) {
        Case thisCase = new Case(
                Id=id,
                Subject=subject,
                Status=status,
                Origin=origin,
                Priority=priority);
        // Match case by Id, if present.
        // Otherwise, create new case.
        upsert thisCase;
        // Return the case ID.
        return thisCase.Id;
    }
    @HttpPatch
    global static ID updateCaseFields() {
        RestRequest request = RestContext.request;
        String caseId = request.requestURI.substring(
            request.requestURI.lastIndexOf('/')+1);
        Case thisCase = [SELECT Id FROM Case WHERE Id = :caseId];
        // Deserialize the JSON string into name-value pairs
        Map<String, Object> params = (Map<String, Object>)JSON.deserializeUntyped(request.requestbody.tostring());
        // Iterate through each parameter field and value
        for(String fieldName : params.keySet()) {
            // Set the field and value on the Case sObject
            thisCase.put(fieldName, params.get(fieldName));
        }
        update thisCase;
        return thisCase.Id;
    }    
}
```
URL to test it in postman
```
https://thecodingstudio2-dev-ed.develop.my.salesforce.com and after that need to add some code as follows:
Cases at last in below url is urlMappimg from above apex class....
https://thecodingstudio2-dev-ed.develop.my.salesforce.com/services/apexrest/Cases

and after that need to Add sessionId to Authorization as a bearer Token in postman and this sessionId and Base url is get from the Organizer Extension and If want to do it all this Automatically so need to use connected app and name credential and refer it from below youtube Video after 58Mins
https://youtu.be/2myol9hI28c?si=vwdcERe2MenZIZ3C
```

Trigger: Amount Of the Opportunity Should not be Change, it can stay as it is, if it is changing then it must throws an error.
```
trigger PracticeTrigger on CallNot__c (before Update) {
    if(Trigger.isBefore && Trigger.isUpdate){
        for(CallNot__c cn: Trigger.New){
            CallNot__c oldValue = Trigger.oldMap.get(cn.Id); //to get the old value
            if(oldValue.Status__c != cn.Status__c){
                cn.Status__c.addError('Field Changing is not allow');
            }
        }
    }
```
Trigger: when Accounts Billing city is change then also update its related Contacts Mailing City

```
trigger PracticeTrigger2 on Account (after Insert, after Update) {
    if (Trigger.isAfter && (Trigger.isInsert || Trigger.isUpdate)) {
        List<Contact> conList = new List<Contact>();

        for (Account acc : Trigger.New) {
             Account oldAccount = Trigger.oldMap.get(acc.Id);

             if (oldAccount.BillingCity != acc.BillingCity) {
                 List<Contact> contactsToUpdate = [SELECT Id, MailingCity FROM Contact WHERE AccountId = :acc.Id];

                 for (Contact con : contactsToUpdate) {
                    con.MailingCity = acc.BillingCity;
                    conList.add(con);
                }
            }
        }

         if (!conList.isEmpty()) {
            update conList;
        }
    }
}

```
Trigger: Create an asset when create an OpportunityLineItem with associated Account.

```
//With using Map and set
trigger PracticeTrigger3 on OpportunityLineItem (after insert) {
    List<Asset> assetList = new List<Asset>();

    // Collect the Account IDs associated with the OpportunityLineItems
    Set<Id> accountIds = new Set<Id>();
    for (OpportunityLineItem oli : Trigger.New) {
        accountIds.add(oli.Opportunity.AccountId);
    }

    // Query the related Accounts
    Map<Id, Account> accountsMap = new Map<Id, Account>([SELECT Id, Name FROM Account WHERE Id IN :accountIds]);

    // Create Asset records based on OpportunityLineItems
    for (OpportunityLineItem oli : Trigger.New) {
        // Check if the Opportunity has an associated Account
        if (accountsMap.containsKey(oli.Opportunity.AccountId)) {
            Account acc = accountsMap.get(oli.Opportunity.AccountId);

            // Create an Asset and associate it with the Account
            Asset ass = new Asset();
            ass.Name = oli.Name;
            ass.AccountId = acc.Id; // Associate the Asset with the Account
            assetList.add(ass);
        }
    }

    // Insert the Asset records
    if (!assetList.isEmpty()) {
        insert assetList;
    }
}


//OR

//With Using List
trigger PracticeTrigger3 on OpportunityLineItem (after insert) {
    List<Asset> assetList = new List<Asset>();

    for (OpportunityLineItem oli : Trigger.New) {
        // Query the related Account information
        List<Account> accList = [SELECT Id, Name FROM Account WHERE Id = :oli.Opportunity.AccountId LIMIT 1];

        // Check if there is a related Account
        if (!accList.isEmpty()) {
            Account acc = accList[0];

            // Create an Asset and associate it with the Account
            Asset ass = new Asset();
            ass.Name = oli.Name;
            ass.AccountId = acc.Id; // Associate the Asset with the Account
            assetList.add(ass);
        }
    }

    // Insert the Asset records
    if (!assetList.isEmpty()) {
        insert assetList;
    }
}

```
Triggger: Write an apex trigger to prevent the duplicate Account records inside the object
```
trigger PracticeTrigger2 on Account (before Insert , before update) {
    for(Account acc: trigger.new)
    {
        integer AccCount = [select count() from Account where Name=:acc.Name];  //if record will greater than 0 will throws an error.
        if(AccCount>0)
        {
            acc.Name.addError('Duplicate record Found, you cannot create a record wih same candidate name');
        }
    }
    
  }

```

