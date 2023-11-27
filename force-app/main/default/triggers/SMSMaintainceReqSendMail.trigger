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