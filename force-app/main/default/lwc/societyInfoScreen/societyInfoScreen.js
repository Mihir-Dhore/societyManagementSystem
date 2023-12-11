import { LightningElement, track,api,wire } from 'lwc';
import showSocietyInfo from '@salesforce/apex/SMSsearchEvent.showSocietyInfo';
import accountListRelatedToSociety from '@salesforce/apex/SMSsearchEvent.accountListRelatedToSociety';
import showSocietyStaff from '@salesforce/apex/SMSsearchEvent.showSocietyStaff';

import showAmenities from '@salesforce/apex/SMSsearchEvent.showAmenities';
 
import { NavigationMixin } from 'lightning/navigation';

export default class SocietyInfoScreen extends NavigationMixin(LightningElement) {

 
    @track societyData;
    connectedCallback(){
        this.showSocietyInfo();
    }
    showSocietyInfo(){
        showSocietyInfo()
        .then(result=>{
            console.log('Result: ',result);
            this.societyData = result;
        }).catch(error=>{
            console.log('error',error);
        })
    }

    @track showMember = false;
    @track accountData;
    handleMemberClick(){
        this.showMember = !this.showMember;

        // this.showMember = true;
        accountListRelatedToSociety()
        .then(result=>{
            console.log('resultttt: ',result);
            this.accountData = result;
        }).catch(error=>{
            console.log('error: ',error);
        })
    }

    @track societyStaffData;
    @track showStaff = false;
    handleViewSocietyStaffClick(){
        this.showStaff = !this.showStaff;
        showSocietyStaff()
        .then(result=>{
            console.log('resultSociety',result);
            this.societyStaffData = result;
        }).catch(error=>{
            console.log('errorrrr',error);
        })
    }

    @track showAmenities = false;
    @track showAmenitiesData;
    handleAmenitiesClick(){
        this.showAmenities = !this.showAmenities;
        showAmenities()
        .then(result=>{
            console.log('resiltt',result);
            this.showAmenitiesData = result;
            

        }).catch(error=>{
            console.log(error);
        })
    }


     handleAccName(event) {
        const recordId = event.currentTarget.dataset.recordid;
     
        console.log('recordId', recordId);
    
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                actionName: 'view'
            }
        });
    }

 }
    
