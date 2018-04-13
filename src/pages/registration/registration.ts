import { Component } from '@angular/core';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import {HelloIonicPage} from '../hello-ionic/hello-ionic';
import { MainPage } from '../mainpage/mainpage';


@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'
})
export class RegistrationPage {
  constructor(private toastCtrl: ToastController,
	      public nav:NavController) {

  }

  registerUser(email:string, password:string, conf:string,username:string)
  {	

	if(!username)
	{
		this.presentToast("Enter user name");
                return;
	}
		
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(!re.test(email)) {

		this.presentToast("Invalid email");
		return;

	}

	if(!password)
	{
		this.presentToast("Enter password");
                return;
	}

	if(password.length<6)
	{
		this.presentToast("Password length should be atleast 6 characters");
		return;
	}

	var index = password.localeCompare(conf);

	if(index !=0)
	{
		this.presentToast("Password and conform password must be same");
                return;
	}
	this.signupUser(email, password,username);
			
  }

  signupUser(email:string, password:string,username:string) {

	try{      

      const result = firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then( newUser => {
           firebase
           .database()
           .ref('/userProfile')
           .child(newUser.uid)
		   .set({ email: email });
       });
	
	this.presentToast("User created");	

	this.nav.setRoot(MainPage);

	}catch(e){

		this.presentToast("Sorry some error occurs");
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

}
