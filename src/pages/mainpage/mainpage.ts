import { Component } from '@angular/core';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { InboxPage } from '../inbox/inbox';
import { MessagesPage } from '../messages/messages';
import { UserProfilePage } from '../userprofile/userprofile';

@Component({
  selector: 'page-mainpage',
  templateUrl: 'mainpage.html'
})
export class MainPage {
  
  tab1Root = MessagesPage;
  tab2Root = InboxPage;
  tab3Root = UserProfilePage;

    constructor(private toastCtrl: ToastController,
	      public nav:NavController) {

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
