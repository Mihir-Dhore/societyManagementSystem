trigger SMSUpdateNumberOfFlatsOnAccount on Account (after insert, after update, after delete) {
    Set<Id> societyIdsToUpdate = new Set<Id>();

    if (Trigger.isInsert || Trigger.isUpdate) {
        for (Account acc : Trigger.new) {
            societyIdsToUpdate.add(acc.Society__c);
        }
    } else if (Trigger.isDelete) {
        for (Account acc : Trigger.old) {
            societyIdsToUpdate.add(acc.Society__c);
        }
    }

    // Update Society records
    List<Society__c> societiesToUpdate = new List<Society__c>();

    for (Id societyId : societyIdsToUpdate) {
        Society__c society = [SELECT Id, Number_of_Flats__c, (SELECT Id FROM Accounts__r) FROM Society__c WHERE Id = :societyId LIMIT 1];

        society.Number_of_Flats__c = society.Accounts__r.size();
        societiesToUpdate.add(society);
    }

    update societiesToUpdate;
}

 