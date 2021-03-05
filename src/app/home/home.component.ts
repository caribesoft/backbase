import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Data } from '../models/data.model';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
   transactions: Data[];
   accounts: Data[];
   id: string;
   method: string;
   transForm: FormGroup;
   errorMessage:string;
   balance: number=0;
   confirm: boolean=false;
   fraccount: string;
   framount: number;
   isSubmitted = false;
   term: string;


   constructor(private dataService: DataService,
  	public fb: FormBuilder, private router: Router) { }


  sortByDate(){
  	this.dataService.sortByDate().subscribe((catsSnapshot) => { 	
      this.transactions = [];
      catsSnapshot.forEach((catData: any) => {
        this.transactions.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      })
    });
  }

  sortByBene(){
  	this.dataService.sortByBene().subscribe((catsSnapshot) => { 	
      this.transactions = [];
      catsSnapshot.forEach((catData: any) => {
        this.transactions.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      })
    });
  }

  sortByAmount(){
  	this.dataService.sortByAmount().subscribe((catsSnapshot) => { 	
      this.transactions = [];
      catsSnapshot.forEach((catData: any) => {
        this.transactions.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data()
        });
      })
    });
  }

   resetForm(value:any = undefined){
   	  this.transForm.reset(value)
   	  this.confirm = false;
   	  this.errorMessage='';
   	  this.fraccount = '';  
   }

   change(){
   	this.errorMessage='';
   }

   validateForm(){
   	  this.errorMessage='';
   	  this.fraccount = this.transForm.value.toaccount; 
      this.framount = this.transForm.value.amount * -1; 

      if(this.fraccount==''){
      	 this.errorMessage='Select an Account';
      	 return false
      }
      if(!this.framount){
      	this.errorMessage='Enter transfer amount';
      	 return false
      }	 

      if((this.balance + this.framount) < 500 ){
      	  this.errorMessage='ERROR: Your account will overdraft, this transaction will not proceed!';
      	  return false 
      }
      

      this.confirm = true;
   }	

   submitForm(){
  	this.errorMessage='';
	this.dataService.addTransaction(this.fraccount,this.framount);
      
    this.confirm = false; 
    this.resetForm();
    this.errorMessage='Transfer successfully completed'; 
   }


  ngOnInit() {

  	this.reactiveForm()	
  	
    /// GET ALL TRANSACTIONS ///
  	this.dataService.getAllTransactions().subscribe((catsSnapshot) => {
  		this.balance = 0;
      this.transactions = [];
      catsSnapshot.forEach((catData: any) => {
        this.transactions.push({
          id: catData.payload.doc.id,
          data: catData.payload.doc.data(),
        });
        this.balance += catData.payload.doc.data().transaction.amountCurrency.amount;
      })
    });

  	/// GET ALL ACCOUNTS ///
    this.dataService.getAllAccount().subscribe((AcSnapshot) => {
      this.accounts = [];
      AcSnapshot.forEach((data: any) => {
        this.accounts.push({
          idac: data.payload.doc.id,
          data: data.payload.doc.data()
        });
      })
    });
  
  }
   
   /// FORM INITIALIIZATION ///
  reactiveForm() { 
  	this.transForm = this.fb.group({
  	  toaccount: ['', [Validators.required]],	
      amount: ['', [Validators.required]],	
    })  

  }


}
