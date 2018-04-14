import { Component } from '@angular/core';
import firebase from 'firebase';
import { ToastController, Item } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { DataSnapshot } from '@firebase/database-types';
import { InsideQueryPage } from '../insidequery/insidequery';
import { App } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html'
})
export class MessagesPage {

    allQueries: Array<{user_id: string, query: string,email: string,desc:string,answer:string}>;
    latit:any;
    longit:any;

    public firebaseUserId:any;

    constructor(private toastCtrl: ToastController,public app: App,
	  public nav:NavController,public geolocation: Geolocation) {

      this.firebaseUserId = firebase.auth().currentUser.uid;

      this.geolocation.getCurrentPosition().then((resp) => {

          this.latit = resp.coords.latitude;
          this.longit = resp.coords.longitude;

          console.log(resp.coords.latitude);
          console.log(resp.coords.longitude);

          var QueryData = {
            user_id:this.firebaseUserId,
            latitude:this.latit,
            longitude:this.longit
          };

          var updateLoc = {};
          updateLoc['Location/'+ this.firebaseUserId] = QueryData;

          try{
            firebase.database().ref().update(updateLoc);
            this.presentToast("Location recorded");
          }catch(e)
          {
            this.presentToast("please check your internrt connection");
          }

      }).catch((error) => {
          console.log('Error getting location', error);
      });

      this.initializeValues();
        
    }

          // retriving data from firebase

    initializeValues()
    {

      this.allQueries = [];

      var starCountRef = firebase.database().ref('Queries').orderByChild('query');
      let familyList: Array<string>;
      starCountRef.on("value",(snapshot) => {
        //console.log('users', snapshot.val());
        var queries = snapshot.val();
        snapshot.forEach((childSnapshot) => {
          var everyone = childSnapshot.val();

          //catched every single child
          //And the added to the list
          this.allQueries.push({
            user_id: everyone.user_id,
            query: everyone.query,
            email: everyone.email,
            desc: everyone.message,
            answer:everyone.answers,
          });
          console.log(this.allQueries.length);
          console.log(everyone.query);
          console.log(everyone.message); 
          return false; 
        });
      });

    }

    getallQueries(ev: any){

      this.initializeValues();

      let serVal = ev.target.value;
      if (serVal && serVal.trim() != '') {
        this.allQueries = this.allQueries.filter((item) => {
          return (item.query.toLowerCase().indexOf(serVal.toLowerCase()) > -1);
        })
      }
      else
      {
        this.allQueries = this.allQueries.filter((item) => {

          return (item.query);
        })
      }

    }

    presentToast(value:string) {
 
	  let toast = this.toastCtrl.create({
	    message: value,
	    duration: 3000,
	    position: 'bottom'

      });

     toast.present();
    }

    goToInsideQuery(event, item){

      this.app.getRootNav().setRoot(InsideQueryPage,{
        item: item
      });

    }

}
