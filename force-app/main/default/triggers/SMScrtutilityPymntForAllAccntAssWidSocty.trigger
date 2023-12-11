trigger SMScreateutilityPaymentForAllAccountAssoWithSociety on Utility_Invoice__c (After insert) {

    List<Utility_Invoice__c> newInvoices = new List<Utility_Invoice__c>();
     
     List<Utility_Payment__c> utilityPaymentsToInsert = new List<Utility_Payment__c>();
     for(Utility_Invoice__c invoice:Trigger.New){
         List<Account>relatedAccounts = [Select Id,Name,Society__c From Account Where Society__c=:invoice.Society__c];
         
         Decimal AmountPerAccount = invoice.Amount__c / relatedAccounts.size();
         
          for(Account acc:relatedAccounts){
             Utility_Payment__c payment = new Utility_Payment__c();
             payment.Amount__c = AmountPerAccount;
             payment.Account__c = acc.Id;
             payment.Utility_Invoice__c = invoice.Id;
             payment.Status__c = 'New';
             payment.Payment_Date__c = invoice.Due_Date__c;
             payment.Utility_Provider__c = invoice.Utility_Provider__c;
             utilityPaymentsToInsert.add(payment);
         } 
     }
      if (!utilityPaymentsToInsert.isEmpty()) {
         insert utilityPaymentsToInsert;
      } 

}