import { LightningElement, track } from 'lwc';
import showUtilityDetails from '@salesforce/apex/SMSsearchEvent.showUtilityDetails';

import changeUtilityStatus from '@salesforce/apex/SMSsearchEvent.changeUtilityStatus';
import { refreshApex } from '@salesforce/apex';

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
    @track columns = columns;
    connectedCallback(){
        this.showUtilityDetails()
    }

 
    // @track dummy;
    showUtilityDetails(event){
        showUtilityDetails()
        .then(result=>{
        // this.utilityData = result.forEach(bill => {
        //     this.dummy =bill.Society__r.Name;    
        // });
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

    @track rowId;
    callRowAction(event) {
        this.rowId = event.detail.row.Id; //Get RowId of particular Row from datatable
        console.log('RowId get', this.rowId)
        const actionName = event.detail.action.name;  //Get actionName of particular Row from datatable
        console.log('actionName',actionName);

        if (actionName === 'MarkAsPaid') {
            console.log('MarkAsPaid DONEEEE',this.rowId)
            changeUtilityStatus({rowId:this.rowId})
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