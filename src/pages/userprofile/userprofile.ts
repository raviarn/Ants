import { Component } from '@angular/core';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {LoginIonicPage} from '../login-ionic/login-ionic'
import {InsertPage} from '../insert/insert'
import { App } from 'ionic-angular';

@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class UserProfilePage {
  public firebaseAuth: any;
  public firebaseUserref: any;
  public firebaseUser: any;
  public resultt: any;
  constructor(private toastCtrl: ToastController,public nav:NavController,public app: App) {

    this.firebaseAuth = firebase.auth();
    this.firebaseUser = firebase.auth().currentUser.uid;
    this.firebaseUserref = firebase.database().ref('users');
    
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/userProfile/' + userId+'/').once('value').then(function(snapshot) {
      var username = (snapshot.val().email) || 'Anonymous';
      document.getElementById("emailid").innerText = username;

    });

    console.log(this.firebaseUser);       
  }

  logoutUser() {
    try{     
	    const result =  firebase.auth().signOut();
	    this.presentToast("Logout success");
      this.app.getRootNav().setRoot(LoginIonicPage);
    }catch(e){
	    this.presentToast("Sorry Some error occurs");
    }
  }

  goToQuery() {

    var email_id = document.getElementById('emailid').textContent;

    this.app.getRootNav().setRoot(InsertPage,{
      email_id: email_id
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