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