import { Component } from '@angular/core';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ReplyPage } from '../reply/reply';
import { App } from 'ionic-angular';

@Component({
  selector: 'page-inbox',
  templateUrl: 'inbox.html'
})
export class InboxPage {

  allMessages: Array<{email: string,msg:string,user_id:string}>;
  public firebaseUserId:any;
  
    constructor(private toastCtrl: ToastController,
	      public nav:NavController,public app: App) {

          this.allMessages = [];
          this.firebaseUserId = firebase.auth().currentUser.uid;

          var starCountRef = firebase.database().ref('Messages/'+this.firebaseUserId).orderByChild('email');
          let familyList: Array<string>;
          starCountRef.on("value",(snapshot) => {
            //console.log('users', snapshot.val());
            var queries = snapshot.val();
            snapshot.forEach((childSnapshot) => {
              var everyone = childSnapshot.val();

              //catched every single child
              //And the added to the list
              this.allMessages.push({
                email: everyone.email,
                msg: everyone.message,
                user_id: everyone.sender_id,
              });
              console.log(this.allMessages.length);
              console.log(everyone.message); 
              return false; 
            });
          });

  }

  goToReply(item){

    this.app.getRootNav().setRoot(ReplyPage,{
      item: item
    });

  }
  
  presentToast(value:string) {
 
	let toast = this.toastCtrl.create({
	message: value,
	duration: 3000,
	position: 'bottom'

     });

     toast.present();
  }

}
