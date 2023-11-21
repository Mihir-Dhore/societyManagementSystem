import { LightningElement, track } from 'lwc';
import showUtilityDetails from '@salesforce/apex/SMSsearchEvent.showUtilityDetails';

import changeUtilityStatus from '@salesforce/apex/SMSsearchEvent.changeUtilityStatus';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Amount', fieldName: 'Amount__c' },
    { label: 'Society', fieldName: 'Society__c'},
    { label: 'Status', fieldName: 'Status__c'},
    { label: 'Utility Provider', fieldName: 'Utility_Provider__c'},
 
    {
        type: "button", label: 'Mark As Paid', initialWidth: 200, typeAttributes: {
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

    @track dummy;

    showUtilityDetails(){
        showUtilityDetails()
        .then(result=>{

        // this.utilityData = result.forEach(bill => {
        //     this.dummy =bill.Society__r.Name;
            
        // });

             this.utilityData = result.map(record =>({
                ...record, //used to include all existing fields of each record in the new object
                buttonLabel: record.Status__c === 'Paid' ? 'Already Paid' : 'Mark As Paid'
            }));
            return refreshApex(this.utilityData);

 
    
        })
        .catch(error=>{
            console.log(error,'error');
        })
    
    }

    callRowAction(event) {
        const rowId = event.detail.row.Id; //Get RowId of particular Row from datatable
        console.log('RowId', this.rowId)
        const actionName = event.detail.action.name;  //Get actionName of particular Row from datatable
        console.log('actionName', this.actionName)

        if (actionName === 'MarkAsPaid') {
            console.log('MarkAsPaid DONEEEE')
            changeUtilityStatus()
            .then(result =>{
                console.log('Status Updated Successfully',result);
                this.showUtilityDetails();
            })
            .catch(error=>{
                console.log(error,'Erorrrr')
            })
        }  
    }
}