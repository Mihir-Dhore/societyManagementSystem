public without sharing class SMSsearchEvent {
     
    // method to check whether current user contact society field is empty or not
    @AuraEnabled
    public static String isCurrentUserSocietyEmpty() {
    String UserEmail = UserInfo.getUserEmail();
    Contact userContact = [SELECT Society__c FROM Contact WHERE Email = :UserEmail LIMIT 1];
    if (userContact != null && String.isNotBlank(userContact.Society__c)) {
        return userContact.Society__c; //it return society Id
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
 public static String registerForEvent(String eventId, String selectedRowsId) {
    String currentUserName = UserInfo.getUserName();
    
    // Query for the contact based on selectedRowsId
    List<Contact> conList = [SELECT Id, FirstName, LastName, Email FROM Contact WHERE Id = :selectedRowsId LIMIT 1];
    
    if (!conList.isEmpty()) {
        // Check if the contact is already registered for the event
        List<Event_Registration__c> existingRegistrations = [SELECT Id FROM Event_Registration__c WHERE Event__c = :eventId AND Contact__c = :conList[0].Id LIMIT 1];

        if (existingRegistrations.isEmpty()) {
            // If not registered, create a new registration
            Event_Registration__c eventRegistration = new Event_Registration__c();
            eventRegistration.Event__c = eventId;
            eventRegistration.Contact__c = conList[0].Id;
            eventRegistration.Email__c = conList[0].Email;
            
            insert eventRegistration;

            return 'Contact Added Successfully';
        } else {
            return 'Contact is already registered for the event';
        }
    } else {
        return 'Contact not found';
    }
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
 
    /*
   //To add Family Member of Login User.
    @AuraEnabled
    public static list<Contact> getFamilyMemberInRegiScreen(String eventId){
        List<Contact> addContact = new List<Contact>();
       String currentUserName = UserInfo.getUserName();
        List<Event_Registration__c> eventRegList = [Select Id, Event__c, Email__c From Event_Registration__c Where Email__c =: currentUserName AND Event__c =: eventId];
        if (eventRegList.isEmpty()) 
        {
            List<Account> accList = [Select Id, Name,Email__c From Account where Email__c =:currentUserName];
            for(Account acc:accList)
            {
                List<Contact> conList = [Select Id,Name, Email From Contact Where AccountId=:acc.Id];
                addContact.addAll(conList);
            }
            
        }
             return addContact;
      
        
    }  
    */
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
    
    //To Add Family Member
    @AuraEnabled
    public static String createContact(String firstName,String lastName, String email, String phone){
        
        String currentUserName = UserInfo.getUserName();
        List<Account> getAccounts = [Select Id,Name, Email__c From Account Where Email__c =:currentUserName];
 
        if(getAccounts!=Null)
        {
               Contact newContact = new Contact();
               newContact.AccountId = getAccounts[0].Id;
                newContact.FirstName = firstName;
                newContact.LastName = lastName;
                newContact.Email = email;
                newContact.Phone = phone;
           
               insert newContact;
               return 'Contact Added Succesfully';

        }
        return 'Error';
    }
    
    //To fetch Account Information
   @AuraEnabled(Cacheable=true)
    public static List<Account> showAccountDetails() {
    String currentUserName = UserInfo.getUserName();
    List<Account> accList = [SELECT Id, Name, Email__c FROM Account WHERE Email__c = :currentUserName];
    return accList;
}

    //Show the Utility Payment Details
    @AuraEnabled
    public static list<Utility_Payment__c> showUtilityDetails(){
        String currentUserName = UserInfo.getUserName();
        
        List<Account> accList = [Select Id, Name, Email__c From Account Where Email__c =:currentUserName];
        List<Utility_Payment__c> utiList = [Select Id,Name, Account__c,Account__r.Name,Amount__c,Status__c,Utility_Provider__c,Utility_Provider__r.Name From Utility_Payment__c Where Account__c =: accList[0].Id ];
        return utiList;
    }

    //Update the Status Value Of Utility Invoice as After Click on 'Mark as Lead'.
@AuraEnabled
public static String changeUtilityStatus(String rowId) {
    String currentUserName = UserInfo.getUserName();

     List<Account> accList = [SELECT Id, Name, Email__c FROM Account WHERE Email__c = :currentUserName];

     List<Utility_Payment__c> utiList = [SELECT Id, Name, Account__c, Amount__c,
                                        Status__c,Utility_Provider__r.Name 
                                        FROM Utility_Payment__c WHERE Account__c = :accList[0].Id AND Id =:rowId];

     Boolean unpaidFound = false;

     for (Utility_Payment__c utility : utiList) {
         if (utility.Status__c == 'Unpaid' && utility.Status__c != null || utility.Amount__c != Null) {
             utility.Status__c = 'Paid';
          //   utility.Amount__c = 0;
            unpaidFound = true;
        }
    }

     update utiList;

     if (unpaidFound) {
        return 'Update Successfully';
    } else {
        return 'No Unpaid Invoices Found';
    }
}
    //delete Related Contact On Utility
    @AuraEnabled
    public static String deleteRelatedContactOnUtility(String contactId){
        List<Contact> conList = [Select Id, Name From Contact Where Id=:contactId ];
       
            delete conList;
            return 'Deleted successfully!';
             
    }
    
    //To Show Maintainace Request Data
    @AuraEnabled
    public static list<Maintenance_Request__c> showMaintenanceRequestData(){
        String currentUserName = UserInfo.getUserName();
        List<Account> accList = [Select Id, Name, Email__c From Account where Email__c=:currentUserName];
        List<Maintenance_Request__c> maintenanceList = [Select Id, Name, Description__c,Account__c,Society__r.Name,Status__c,Contact__r.Name From Maintenance_Request__c Where Account__c=:accList[0].Id ];
        return maintenanceList;
    }
    
    @AuraEnabled
    public static String insertMaintainanceReq( String description){
        String currentUserName = UserInfo.getUserName();
        List<Account> accList = [Select Id, Name, Society__c,Email__c From Account where Email__c=:currentUserName];
        if(accList!=Null)
         {
            Maintenance_Request__c mainReq = new Maintenance_Request__c();
            mainReq.Account__c =  accList[0].Id;
            mainReq.Description__c = description;
            mainReq.Society__c = accList[0].Society__c;
             
            insert mainReq;
            return 'Inserted Succesfully';
            
       }
        return 'Error Occrured';
         
    }
}