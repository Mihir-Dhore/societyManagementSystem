trigger SMSEventRegiSendMail on Event_Registration__c (after insert) {

    List<Messaging.SingleEmailMessage> emailMessages = new List<Messaging.SingleEmailMessage>();

    List<Event_Registration__c> eventRegistrations = [SELECT Id, Name, Event__c, Event__r.Name, Email__c
    FROM Event_Registration__c
    WHERE Id IN :Trigger.newMap.keySet()];
    for (Event_Registration__c event : eventRegistrations) {
        
        String subject = 'Event Registration';
        String body = 'You have Successfully Registered for the '+event.Event__r.Name+' Event.\n\n';
        body += 'Event Details:\n';
        body += 'Event Registration Number: ' + event.Name + '\n';
        body += 'Event Name : ' + event.Event__r.Name + '\n';
        body += 'Date: ' + System.Today();
      
       // String currentUserEmail = UserInfo.getUserEmail();

        Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
        email.setSubject(subject);
        email.setPlainTextBody(body);
        email.setToAddresses(new String[]{event.Email__c}); 

        emailMessages.add(email);
    }

    Messaging.sendEmail(emailMessages);

}