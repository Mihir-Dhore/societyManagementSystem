public without sharing class SMSsearchEvent {
    @AuraEnabled(cacheable=true)
    public static List<Event__c> findEvents(String searchKey) {
        String key = '%' + searchKey + '%';
        return [ SELECT Id, Name,Date_and_Time__c, Eligibility__c, Event_Image__c, Location__c, Resident__r.Name, Society__r.Name FROM Event__c WHERE (Name LIKE :key)];
    }
    
    //For Registration
    @AuraEnabled
    public static void registerForEvent(Id eventId) {
           
    List<Resident__c> residentList = [SELECT Id, Name FROM Resident__c];
    List<User> userList = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];

    Event_Registration__c registration = new Event_Registration__c();
    registration.Event__c = eventId;

     for (Resident__c resident : residentList) {
        for (User user : userList) {
            if (resident.Name == user.Name) {
                 registration.Resident__c = resident.Id;
                insert registration;
                return;  
            }
        }
    }

  } 

}