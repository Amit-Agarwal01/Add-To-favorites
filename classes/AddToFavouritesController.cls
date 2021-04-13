public class AddToFavouritesController {
    public AddToFavouritesController() {

    }
    public class RecordWrapper {
        @AuraEnabled
        public  List<Contact> contactList   { get; set; }
        @AuraEnabled
        public List<Account> accountList    { get; set; }
        @AuraEnabled
        public List<Opportunity> oppList    { get; set; }
    }

    @AuraEnabled
    public static String fetchRecords(){
        try {
           RecordWrapper  recWrap = new RecordWrapper();

           List<Contact> contactList = new List<Contact>();
           contactList = [Select id,Name,Phone from Contact Order By Name DESC LIMIT 10 ];
           recWrap.contactList = contactList;

           List<Account> accountList = new List<Account>();
           accountList = [Select id,Name,Phone from Account Order By Name LIMIT 10];
           recWrap.accountList = accountList;

           List<Opportunity> oppList = new List<Opportunity>();
           oppList = [Select id,Name from Opportunity Order By Name LIMIT 10];
           recWrap.oppList = oppList;

           System.debug('recWrap '+recWrap );
           return JSON.serialize(recWrap);

        } catch (Exception ex) {
         return JSON.serialize(ex);
        }
    }

    @AuraEnabled
    public static String addTofavourite(String recorIdVal, String recordName )
    {
        String objectName = '';
        String keyPrefix = recorIdVal.substring(0,3);
        for( Schema.SObjectType obj : Schema.getGlobalDescribe().Values() ){
             String prefix = obj.getDescribe().getKeyPrefix();
              if(prefix == keyPrefix){
                        objectName = obj.getDescribe().getName();
                         break;
               }
        }
        List<Add_Favourites__c> addfavRecords= new List<Add_Favourites__c>();
        addfavRecords = [Select id,Object_RecordId__c FROM Add_Favourites__c WHERE Object_RecordId__c =:recorIdVal] ;
        Add_Favourites__c addfav = new Add_Favourites__c();
        List<Add_Favourites__c> addfavlist = new List<Add_Favourites__c>();
        System.debug('addfavRecords '+addfavRecords);
      if (addfavRecords.isEmpty() ){   
        addfav.Object_Name__c = objectName ;
        addfav.Object_Record_Name__c = recordName ;
        addfav.Object_RecordId__c = recorIdVal;
        addfavlist.add(addfav);
        insert addfavlist;
        return addfavlist[0].id ;
      }
      else{
        delete addfavRecords ;
        return 'Record Removed from Favourites';
     }
    }
}
