import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
	message:string='';
	single: any;
	public logo: string='';

  constructor(public firestore: AngularFirestore) { }


  

  getAllTransactions() {
    return this.firestore.collection('data').snapshotChanges();
  }

  sortByDate() {
    return this.firestore.collection('data', ref => ref.orderBy("dates.valueDate","asc")).snapshotChanges();
  }

  sortByBene() {
    return this.firestore.collection('data', ref => ref.orderBy("merchant.name","asc")).snapshotChanges();
  }

  sortByAmount() {
    return this.firestore.collection('data', ref => ref.orderBy("transaction.amountCurrency.amount","asc")).snapshotChanges();
  }
 
  getAllAccount(){
  	return this.firestore.collection('accounts', ref => ref.orderBy("name","asc")).snapshotChanges();
  }

  getLogo(account){
    
  	console.log("NAME ", account);
     this.firestore.collection('accounts', ref => ref.where('name', '==', account)).get()
     .subscribe(ss => {
            ss.docs.forEach(doc => {
              this.single = doc.data();
            })
           this.logo = this.single.logo;
           console.log("EL LOGO ", this.logo)
        })
    return this.logo
  }

  addTransaction(account,amount) { 
    let now = Date.now();
    //let logo = this.getLogo(account);

    /// GET THE LOGO ///
    this.firestore.collection('accounts', ref => ref.where('name', '==', account)).get()
     .subscribe(ss => {
            ss.docs.forEach(doc => {
              this.single = doc.data();
            })
           this.logo = this.single.logo;
     
          return this.firestore.collection('data').add({
		    	transaction: {
		    		amountCurrency: {
		    			currencyCode: 'EUR',
		    			amount: amount,
		    		}	
		    	},
		    	merchant: {
		    		name: account,
		    		accountNumber: 'SI64397745065188826',
		    	},
		    	dates : {
		    		valueDate: now,
		    	},
		    	type: 'Card Payment',
		    	logo: this.logo,	
			});

     });
    
  }
   

}
