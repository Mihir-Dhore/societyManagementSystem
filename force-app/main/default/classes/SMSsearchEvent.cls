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
    
    //For Registration
    @AuraEnabled
    public static void registerForEvent(Id eventId) {
           
    List<Contact> residentList = [SELECT Id, Name, Email FROM Contact];
    List<User> userList = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];

    Event_Registration__c registration = new Event_Registration__c();
    registration.Event__c = eventId;

     for (Contact resident : residentList) {
        for (User user : userList) {
            if (resident.Name == user.Name) {
                 registration.Contact__c = resident.Id;
                 registration.Email__c = resident.Email; 
                insert registration;
                return;  
            }
        }
    }

  }  
    //To Select Society
    @AuraEnabled
    public static List<Event__c> selectSociety(String eventId) {
    
    return [SELECT Id, Name, Date_and_Time__c, Eligibility__c, Event_Image__c, Location__c, Contact__r.Name, Society__r.Name FROM Event__c WHERE Society__c = :eventId];
}
   
    //For MyProfile --> List of related Contact
    @AuraEnabled(cacheable=true)
    public static List<Contact> myProfileRelatedContact(String eventId) {
         return [SELECT Id, Name, Society__c FROM Contact WHERE Society__c = :eventId];
    }

}
