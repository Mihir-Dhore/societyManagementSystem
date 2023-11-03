public without sharing class SMSsearchEvent {
    @AuraEnabled(cacheable=true)
    public static List<Event__c> findEvents(String searchKey) {
        String key = '%' + searchKey + '%';
        return [ SELECT Id,Name, Date_and_Time__c, Eligibility__c, Event_Image__c, Location__c, Contact__c, Society__r.Name FROM Event__c WHERE (Name LIKE :key)];
    }
    
    //For Registration
    @AuraEnabled
    public static void registerForEvent(Id eventId) {
           
    List<Contact> residentList = [SELECT Id, Name FROM Contact];
    List<User> userList = [SELECT Id, Name FROM User WHERE Id = :UserInfo.getUserId()];

    Event_Registration__c registration = new Event_Registration__c();
    registration.Event__c = eventId;

     for (Contact resident : residentList) {
        for (User user : userList) {
            if (resident.Name == user.Name) {
                 registration.Contact__c = resident.Id;
                insert registration;
                return;  
            }
        }
    }

  } 
    @AuraEnabled
    public static List<Event__c> selectSociety(String eventId) {
    //String key = '%' + eventId + '%';
    return [SELECT Id, Name, Date_and_Time__c, Eligibility__c, Event_Image__c, Location__c, Contact__r.Name, Society__r.Name FROM Event__c WHERE Society__c = :eventId];
}

    

}