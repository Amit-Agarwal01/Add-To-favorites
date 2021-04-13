import { LightningElement } from 'lwc';
import fetchRecords from '@salesforce/apex/AddToFavouritesController.fetchRecords';
import addTofavourite from '@salesforce/apex/AddToFavouritesController.addTofavourite';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class AddToFavourites extends NavigationMixin(LightningElement) {

    contactList;
    accountList;
    oppList;
    error;

    connectedCallback(){
        this.fetchRecords();
    } 

    fetchRecords() {
        fetchRecords()        
        .then(data => {
             const wrapper = JSON.parse(data);
             if(wrapper){
                 this.contactList = wrapper.contactList;
                 this.accountList = wrapper.accountList;
                 this.oppList = wrapper.oppList;
                 this.error = undefined ;
             }
        })
        .catch(error => {
            this.contactList = undefined;
            this.accountList = undefined;
            this.oppList = undefined;
            console.log(error);
        });
    }

    addTofav(event){   
        const recorIdVal = event.detail.recordId;
        const recordName = event.detail.recordName;
        
        addTofavourite({
            recorIdVal : recorIdVal,
            recordName : recordName,
        })
        .then(data => {
            console.log(' Add To Fav ', data);
            if(data == 'Record Removed from Favourites'){
                /*const toast = new ShowToastEvent({
                    'title' : 'Success',
                    "message" :'Record Removed from Favourites',
                    "variant" : "Success", 
                });
                this.dispatchEvent(toast);*/
                    const event = new ShowToastEvent({
                        "title": "Success!",
                        "message": "Record {0} Removed from favorites!",
                        "messageData": [
                            recordName,
                            {
                                url: 'http://www.salesforce.com/',
                                label: 'here'
                            }
                        ],
                        "variant" : "Success", 
                    });
                    this.dispatchEvent(event);
            }else{
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: recorIdVal,
                        actionName: 'view',
                    },
                }).then(abc => {
                    const event = new ShowToastEvent({
                        "title": "Success!",
                        "message": "Record {0} added to favourites!!  {1}",
                        "messageData": [
                            recordName,
                            {
                             //   url : '/lightning/r/' + recorIdVal  + '/view', 
                                  url : '/lightning/o/Add_Favourites__c/home', // '/list',//?filterName=00B6F00000K9QURUA3
                                label: 'View'
                            }
                        ],
                        "variant" : "Success", 
                    });
                    this.dispatchEvent(event);
                });
         }
        })
        .catch(error => {
            console.log(error);
            const toast = new ShowToastEvent({
                'title' : 'Error!!',
                "message" : JSON.stringify(error),
                "variant" : "error", 
            });
            this.dispatchEvent(toast);
        });

    }
}