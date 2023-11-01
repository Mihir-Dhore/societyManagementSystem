trigger SMSUtilityBillReminder on Flat__c (before update) {
    List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();

   for (Flat__c ft : Trigger.new) {
       if(ft.Utility_Invoice__c != null && ft.Flat_Owner_Email__c!=null){
       Messaging.SingleEmailMessage emailMsg = new Messaging.SingleEmailMessage();
       String[] toAddresses = new String[] { ft.Flat_Owner_Email__c };
       emailMsg.setToAddresses(toAddresses);

       emailMsg.setSubject('Utility Bill Reminder💸');

       String emailBody = 'Dear ' + ft.Flat_Owner_Name__c + ',<br/><br/>' +
           'I hope this message finds you well. We want to remind you that your upcoming utility bill is due soon. Timely payment ensures uninterrupted service and helps you avoid late fees.<br/><br/>' +
           'Account Name:' + ft.Flat_Owner_Name__c + '<br/>'+
           
           'Bill Amount: ' + ft.Utility_Invoice__c + '<br/>' +
           
            'Please make your payment by the due date to avoid any late fees or service interruptions.<br/>' +
           'Thank you for choosing us as your utility provider. Your prompt payment is greatly appreciated and helps us maintain the quality of our services.<br/><br/>';

       emailMsg.setHtmlBody(emailBody);
       emailList.add(emailMsg);
       }
   }
   Messaging.sendEmail(emailList);
}