import { LightningElement, track } from 'lwc';
import insertFeedback from '@salesforce/apex/SMSsearchEvent.insertFeedback';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class FeedbackScreen extends LightningElement {
    
    @track name;
    @track description;
 
    handleNameChange(event){
        this.name = event.detail.value;
 
    }
    handleDescriptionChange(event){
        this.description = event.detail.value;
    }
    handleSubmitClick(){
        insertFeedback({name:this.name,description:this.description})
        .then(result=>{
            console.log('result',result);
             if(result=='Already Submitted'){
                this.dispatchEvent(new ShowToastEvent({
                    title: "Already Submitted!",
                    variant:"error"
                }));
            }else{
                this.dispatchEvent(new ShowToastEvent({
                    title: "Feedback Submitted Succesfully",
                    variant: "success"
                }));
        }
        }).catch(error=>{
            console.log('error',error)
        })
    }
    
}