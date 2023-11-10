public without sharing class SMSsearchEvent {
     
    // method to check wether current user contact society field is empty or not
    @AuraEnabled(cacheable=true)
    public static String isCurrentUserSocietyEmpty() {
    String UserEmail = UserInfo.getUserEmail();
    Contact userContact = [SELECT Society__c FROM Contact WHERE Email = :UserEmail LIMIT 1];
    if (userContact != null && String.isNotBlank(userContact.Society__c)) {
        return userContact.Society__c;
    } else {
        return 'False'; 
    }
}
    
    // return all events data in event page
     @AuraEnabled
    public static List<Event__c> SearchEventsForAlreadyRagstered(String AlreadyRagistered) {
        List<Event__c> events = [SELECT Id, Name, Date_and_Time__c, Location__c, Contact__r.Name, Society__r.Name, Event_Image__c, Eligibility__c
            FROM Event__c
            WHERE Date_and_Time__c >= TODAY AND Society__c = :AlreadyRagistered];
        return events;
    }


    // for update the society on account for new user
    @AuraEnabled
    public static String UpdateAccountSociety(String SocietyId) {
    String currentUserName = UserInfo.getUserName();    
    User currentUser = [SELECT Id,Username FROM User WHERE Username = :currentUserName LIMIT 1];  
    if (currentUser != null) {
        Account flatOwner = [SELECT Id, Society__c, Email__c FROM Account WHERE Email__c = :currentUser.Username LIMIT 1];   
        if (flatOwner != null && flatOwner.Society__c == null) {
            flatOwner.Society__c = SocietyId;
            update flatOwner;
            return 'Society__c field updated successfully';
        } else {
            return 'Society__c field is already populated';
        }
    } 
    return 'Account or User not found, or other issues occurred.';
}
    
    // current user Register for events
@AuraEnabled
public static String registerForEvent(String eventId) {
    String currentUserName = UserInfo.getUserName();

    List<Event_Registration__c> eventRegistrations = [SELECT Event__c, Email__c, Contact__c FROM Event_Registration__c WHERE Event__c = :eventId AND Email__c = :currentUserName];

    if (eventRegistrations.size() > 0) {
        return 'Already Registered';
        } else {
        List<Contact> ListOfAllContact =[SELECT Id From Contact where Email =:currentUserName];  
        if (eventRegistrations.isEmpty()) {
            Event_Registration__c newRegistration = new Event_Registration__c();
            newRegistration.Event__c = eventId;
            newRegistration.Email__c = currentUserName;
            newRegistration.Contact__c =ListOfAllContact[0].Id;
            insert newRegistration;
            return 'User Registered Successfully';
        }
    }

    return 'User Not Registered';
}   
    
    //To Select Society
    @AuraEnabled
    public static List<Event__c> selectSociety(String eventId) {
    
    return [SELECT Id, Name, Date_and_Time__c, Eligibility__c, Event_Image__c, Location__c, Contact__r.Name, Society__r.Name FROM Event__c WHERE Society__c = :eventId];
}
    
    //To Check is user already registered or not
    @AuraEnabled
    public static String checkUserRegistrationForEvent(String eventId){
        String currentUserName = UserInfo.getUserName();
        List<Event_Registration__c> eventRegList = [Select Id, Event__c, Email__c From Event_Registration__c Where Email__c =: currentUserName AND Event__c =: eventId];
        if (eventRegList.size() > 0) {
        return 'Already Registered';
        } 
        return 'Please Register';
    }
   
   
    //For MyProfile --> List of related Contact
    @AuraEnabled(cacheable=true)
    public static List<Contact> GetRelatedContacts(){ 
        String currentUserName = UserInfo.getUserName();
        List<Account> getAccounts = [Select Id, Name, Email__c From Account Where Email__c=:currentUserName];
        List<Contact> getRelatedContacts = new List<Contact>();
        for(Account acc: getAccounts){
            List<Contact> addRelatedCon = [Select Id, Name, Phone, Email From Contact Where AccountId =: acc.Id];
            getRelatedContacts.addAll(addRelatedCon);
         }
        return getRelatedContacts;
    }
}