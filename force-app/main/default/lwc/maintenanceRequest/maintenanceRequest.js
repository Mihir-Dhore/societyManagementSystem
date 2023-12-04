import { LightningElement, track } from 'lwc';
import showMaintenanceRequestData from '@salesforce/apex/SMSsearchEvent.showMaintenanceRequestData';
import insertMaintainanceReq from '@salesforce/apex/SMSsearchEvent.insertMaintainanceReq';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Description', fieldName: 'Description__c',initialWidth: 350},
    { label: 'Society', fieldName: 'societyName',initialWidth: 300},
    { label: 'Requested Date', fieldName: 'Request_Date__c',initialWidth: 300 },
    { label: 'Status', fieldName: 'Status__c',initialWidth: 300 },
    // { label: 'Requested By', fieldName: 'requestedBy' },
 ];

export default class MaintenanceRequest extends LightningElement {
    
    @track maintainenceData;

    columns = columns;


    connectedCallback(){
        this.showMaintainaceDetails();
    }
    showMaintainaceDetails(){
        showMaintenanceRequestData()
        .then(result=>{
 
            this.maintainenceData = result.map(record=>({
                ...record,
                // Assignedto: item.Assigned_to__r ? item.Assigned_to__r.Name : '',
                societyName: record.Society__r ? record.Society__r.Name : '',
                // requestedBy: record.Contact__c ? record.Contact__r.Name : ''
            }));
            
         
        }).catch(error=>{
            console.log('Error',error);
        })
    }


    @track showMaintainenceForm = false;
    
    handleMaintainenceClick(){
         this.showMaintainenceForm = true;

    }

    @track description = '';
    handleDescriptions(event){
        this.description = event.target.value;
     }
 
     handleSave() {
        let isValid = true;
    
         this.template.querySelectorAll("lightning-textarea").forEach(item => {
            let fieldValue = item.value;
            let fieldLabel = item.label;
            let fieldErrorMsg = 'Please Enter the';
    
            if (!fieldValue) {
                isValid = false;
                item.setCustomValidity(fieldErrorMsg + " " + fieldLabel);
            } else {
                item.setCustomValidity("");
            }
            item.reportValidity();
        });
    
        // If any field is empty, do not proceed with saving
        if (!isValid) {
            return;
        }
    
        // All fields are filled, proceed with saving
        insertMaintainanceReq({ description: this.description })
            .then(result => {
                console.log('Added Successfully', result);
    
                this.dispatchEvent(new ShowToastEvent({
                    title: "Maintenance Request Added Successfully!",
                    variant: "success"
                }));
                this.showMaintainenceForm = false;
                this.showMaintainaceDetails();
                // return refreshApex(this.maintainenceData);
    
            }).catch(error => {
                console.log('Error', error);
            });
    }
        handleCancel(){
        this.showMaintainenceForm = false;

    }

}