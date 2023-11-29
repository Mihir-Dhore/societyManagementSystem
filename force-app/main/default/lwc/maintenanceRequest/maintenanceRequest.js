import { LightningElement, track } from 'lwc';
import showMaintenanceRequestData from '@salesforce/apex/SMSsearchEvent.showMaintenanceRequestData';
import insertMaintainanceReq from '@salesforce/apex/SMSsearchEvent.insertMaintainanceReq';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Description', fieldName: 'Description__c',initialWidth: 500},
    { label: 'Society', fieldName: 'societyName'},
    { label: 'Requested Date', fieldName: 'Request_Date__c' },
    { label: 'Status', fieldName: 'Status__c' },
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
 
     handleSave(){
        insertMaintainanceReq({description:this.description})
        .then(result=>{
            console.log('Added Successfully',result);
            
            this.dispatchEvent(new ShowToastEvent({
                title: "Maintainance Request Added Successfully!",
                 variant: "success"
            }));
            this.showMaintainenceForm = false;
            this.showMaintainaceDetails();
            // return refreshApex(this.maintainenceData);
    
        }).catch(error=>{
            console.log('Error',error);
        })

        }
    handleCancel(){
        this.showMaintainenceForm = false;

    }

}