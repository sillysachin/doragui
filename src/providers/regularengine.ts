import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { partner } from '../config/partner';
import { contract } from '../config/contract';
import { ServerlessWallet } from './serverlesswallet';

declare var foo;

let partnerinfo = partner;
let contractinfo = contract;

@Injectable()
export class RegularEngine {

  activatingkeypair : any;
  abcd : any;

  constructor(public http: Http, 
      public serverlessWallet: ServerlessWallet
  ) {

  var network = foo.bitcoin.networks.testnet;
  foo.bitcoincontrol.serverlesslib.init(contractinfo, partnerinfo, network);

  this.getactivatingpair();
     this.abcd = "";
  

  }

  getactivatingpair() {

  var network = foo.bitcoin.networks.testnet;
  var wk = this.serverlessWallet.getBitcoinWallet();

     console.log("wk="+JSON.stringify(wk));   
     console.log("wkwallletwif="+wk.walletwif);   
     var localkeypair = foo.bitcoin.ECPair.fromWIF(wk.walletwif, network);
  this.activatingkeypair = localkeypair;

 
  }
   
  
  rng () { return foo.Buffer.Buffer.from('pzzttyyzzzzzzzzzzzzzzzzzzzzzzzzz') }

  getWalletAddress ()
  {
    
     return this.activatingkeypair.getAddress();

  }

  getSendingSet()
  {
  
  // size of key is taken as input, optional  

  var length = 9;
  var moneydata = {
   planid: 1,
   vendorid: 1,
   expiry: 1,
   createdate: 1,
   randompin: "PIN_"+Math.random().toString(36).substr(2, length).toUpperCase()
  };

  var keyPair = foo.bitcoin.ECPair.makeRandom();
  var uidkey =  keyPair.getPublicKeyBuffer();
  var globalnetwork = foo.bitcoin.networks.testnet;


   var docaddr = foo.bitcoincontrol.serverlesslib.doc1Upload(moneydata,
                uidkey,
                globalnetwork);
   console.log("docaddr = "+docaddr);

   var set = {
      address: docaddr,
      uidkey: uidkey.toString('hex'),
      moneydata: moneydata
   };

   return set;

  }

  


  sendBitcoin(amount, addressset)
  {
    // var addressset = this.getSendingSet();

    var serverlesstype = 1;
    return new Promise((resolve, reject) => { 

    var txpromise = foo.bitcoincontrol.serverlesslib.regularSendingFund(serverlesstype, amount, addressset.address, this.activatingkeypair); // -> popup for partner to send money, amount
    txpromise.then(function(tx) {
     console.log(tx.toHex());
     foo.bitcoincontrol.serverlesslib.sendtx(tx).then(function(tx1) {
     console.log("sending=", JSON.stringify(tx1));
     var txparse = JSON.parse(tx1 );
     if(typeof txparse.tx === 'undefined') reject(txparse)
     else if(txparse.error) reject(txparse)
     else resolve(txparse);
    }).catch (function(error){
     console.log(error);
     reject (error);
    });
    }).catch (function(error){
     console.log(error);
     reject (error);
   });;


   }); 

  } 



  getRandomPubkey(){
    var keyPair = foo.bitcoin.ECPair.makeRandom();
    return keyPair.getPublicKeyBuffer().toString('hex');
  }

  getBalances(addr: any): any {

     var address = '2N43g2SV2PRp3FJUZ92NHDYY36QckV6mSP9'
      if(addr)
      {
             address = addr;
      }
     var url = 'https://api.blockcypher.com/v1/btc/test3/addrs/';
     return new Promise((resolve, reject) => {


     this.http.get(url+address+"/full").map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, (err) => {
          reject(err);
        });
    });


  }



}
