public without sharing class SMSSignUpLogin {

    @AuraEnabled 
       public static void createAccountAndContact(String firstName, String lastName, String email, String Phone, String Password) {
           try {
                Account acc = new Account();
                acc.Name = firstName + ' ' + lastName;
                acc.Email__c = email;
                acc.Phone =Phone;
               
                insert acc;
   
                Contact con = new Contact();
                   con.AccountId = acc.Id;
                   con.FirstName = firstName;
                   con.LastName = lastName;
                   con.Email = email;
                   con.Phone =Phone;
                   insert con;
              
               //user related to contact
                User user = new User();
                   user.Username = email;
                   user.ContactId = con.Id;
                   user.LastName = lastName;
                   user.FirstName = firstName;
                   user.Email = email;
                 //  user.Password__c = Password;
                   user.Alias = 'U-' + String.valueOf(Crypto.getRandomInteger()).substring(0, 6);
                   user.CommunityNickname = email;
                   user.TimeZoneSidKey = 'GMT';
                   user.LocaleSidKey = 'en_US';
                   user.EmailEncodingKey = 'UTF-8';
                   Profile desiredProfile = [SELECT Id FROM Profile WHERE Name = 'Society Management System' LIMIT 1];
                   user.ProfileId = desiredProfile.Id;
                   user.LanguageLocaleKey = 'en_US';
                   user.IsActive = true;
   
               insert user;
               //To Automatically Save Password and login
               system.setpassword(user.Id,Password);
               site.login(user.Username,Password,'/sms/s'); 
                 
           } catch (Exception e) {
    
           }
       }
       
      }