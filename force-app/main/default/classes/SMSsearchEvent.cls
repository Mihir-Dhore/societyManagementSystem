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
    List<Contact> conList = [SELECT Id, FirstName, LastName, Email FROM Contact WHERE Id = :selectedRowsId];
    
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
            List<Contact> addRelatedCon = [Select Id, Name, Phone, Email,Approval_Status__c From Contact Where AccountId =: acc.Id];
            getRelatedContacts.addAll(addRelatedCon);
         }
        return getRelatedContacts;
    }
    
 ///Check for Unregistered Contact For Event
@AuraEnabled(cacheable=true)
public static List<Contact> getUnregisteredContactForEvent(String eventId) { 
    String currentUserName = UserInfo.getUserName();
    List<Account> getAccounts = [SELECT Id, Name, Email__c FROM Account WHERE Email__c = :currentUserName LIMIT 1];
    
    List<Contact> getUnregisteredContacts = new List<Contact>();
    
    if (!getAccounts.isEmpty()) {
        List<Contact> allContacts = [SELECT Id, Name, Phone, Email, Approval_Status__c FROM Contact WHERE AccountId IN :getAccounts];

        List<Event_Registration__c> eventRegList = [SELECT Contact__c FROM Event_Registration__c WHERE Contact__c != null AND Event__c = :eventId];
        Set<Id> registeredContactIds = new Set<Id>();
        
        // Collect the IDs of contacts registered for the event
        for (Event_Registration__c eventReg : eventRegList) {
            registeredContactIds.add(eventReg.Contact__c);
        }

        for (Contact con : allContacts) {
            if (!registeredContactIds.contains(con.Id)) {
                getUnregisteredContacts.add(con);
            }
        }
    }
    
    System.debug('getUnregisteredContacts: ' + getUnregisteredContacts);
    return getUnregisteredContacts;
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
                       system.debug('newContact'+newContact);

               return 'Contact Added Succesfully';

        }
      system.debug('errror');
        return 'Error';
    }
    
    //To fetch Account Information
   @AuraEnabled(Cacheable=true)
    public static List<Account> showAccountDetails() {
    String currentUserName = UserInfo.getUserName();
    List<Account> accList = [SELECT Id, Name, Email__c,Phone FROM Account WHERE Email__c = :currentUserName];
    return accList;
}

    //Show the Utility Payment Details
    @AuraEnabled
    public static list<Utility_Payment__c> showUtilityDetails(){
        String currentUserName = UserInfo.getUserName();
        
        List<Account> accList = [Select Id, Name, Email__c From Account Where Email__c =:currentUserName];
        List<Utility_Payment__c> utiList = [Select Id,Name, Account__c,Account__r.Name,Amount__c,Status__c,Approval_Status__c,Utility_Provider__c,Utility_Provider__r.Name From Utility_Payment__c Where Account__c =: accList[0].Id ];
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
         if (utility.Status__c == 'New' && utility.Status__c != null || utility.Amount__c != Null) {
             utility.Status__c = 'Pending';
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
        List<Maintenance_Request__c> maintenanceList = [Select Id, Name, Description__c,Account__c,Request_Date__c,Society__r.Name,Status__c,Contact__r.Name From Maintenance_Request__c Where Account__c=:accList[0].Id ];
        return maintenanceList;
    }
    //To insert Maintainance Request Data
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
            mainReq.Request_Date__c = System.Today();
             
            insert mainReq;
            return 'Inserted Succesfully';
            
       }
        return 'Error Occrured';
         
    }
    
    //for Feedback Screen
    @AuraEnabled
    public static String insertFeedback(String name, String description){
        String currentUserName = UserInfo.getUserName();
        //String currentUserName = 'sw.saurabhwarge@gmail.com';
        List<Account> accList = [Select Id, Society__c,Name, Email__c From Account Where Email__c =: currentUserName];
        List<Contact> conList = [Select Id, Name, Society__c from Contact Where AccountId=: accList[0].Id And Email =: accList[0].Email__c];
        if(accList!=Null){
            List<Feedback__c> feedList = [Select Id, Name, Description__c,Society__c From Feedback__c Where Society__c=:accList[0].Society__c And Contact__c=: conList[0].Id];
             
            Feedback__c feedback = new Feedback__c();
            if(!feedList.isEmpty()){
                return 'Already Submitted';
            }else{
                feedback.Name = name;
                feedback.Description__c = description;
                feedback.Submission_Date__c = System.Today();
                feedback.Society__c = accList[0].Society__c;
                feedback.Contact__c = conList[0].Id;
                insert feedback;
                return 'Feedback Added Successfully';
            }   
        }
        return 'Error Occured';
    }
    
    //To show Society Info
    @AuraEnabled
    public Static List<Society__c> showSocietyInfo(){
        String currentUserName = UserInfo.getUserName();
        List<Account> accList = [Select Id,Society__r.Name, Name From Account Where Email__c=:currentUserName];
        List<Society__c>societyList = [Select Id,Name,City__c,Address__c,Number_of_Flats__c,Society_Type__c from Society__c Where Name=:accList[0].Society__r.Name];
        return societyList;
    }
    
    //Show Account List Related to Society on Society Screen
    @AuraEnabled
    public static List<Account> accountListRelatedToSociety(){
        String currentUserName = UserInfo.getUserName();
         List<Account> accList = [Select Id,Name,Email__c,Society__c From Account Where Email__c=:currentUserName];
        
         List<Account> showAccList = [Select Id, Name, Email__c,Flat_Number__c,Phone, Society__c From Account Where Society__c =: accList[0].Society__c];
         return showAccList;
    }
    
    //Show Society Staff related to Society
    @AuraEnabled
    public static List<Society_Staff__c> showSocietyStaff(){
        String currentUserName = UserInfo.getUserName();
        List<Account>accList = [Select Id,Name,Society__c From Account Where Email__c=:currentUserName];
        List<Society_Staff__c> societyStaffList = [Select Id,Name,Staff_Role__c, Phone__c,Email__c,Society__r.Name From Society_Staff__c where Society__c=:accList[0].Society__c];
        return societyStaffList;
    }
    
    //Show Amenities
    @AuraEnabled
    public static List<Amenity__c>showAmenities(){
        String currentUserName = UserInfo.getUserName();
        List<Account> accList = [Select Id,Name,Society__c From Account Where Email__c =: currentUserName];
        List<Amenity__c> ameList = [Select Id, Name,Description__c,Availability__c,Society__c,Maintenance_Schedule__c,Booking_Rule__c from Amenity__c Where Society__c=: accList[0].Society__c ];
        return ameList;
        
    }
    //Show Visitors
    @AuraEnabled
    public static List<Visitor__c> showVisitors(){
        String currentUserName = UserInfo.getUserName();
        List<Account> accList = [Select Id,Name from Account Where Email__c=:currentUserName];
        List<Visitor__c> visitorsList = [Select Id,Name,Account__c,Account__r.Name,Address__c,Date_and_Time__c From Visitor__c Where Account__c=:accList[0].Id];
        return visitorsList;
    }
     
 }