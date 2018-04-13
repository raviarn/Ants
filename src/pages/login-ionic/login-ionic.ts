import { Component } from '@angular/core';
import { RegistrationPage } from '../registration/registration';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import {
  IonicPage,
  Loading,
  LoadingController,
  NavController,
  AlertController,
} from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { MainPage } from '../mainpage/mainpage';

@Component({
  selector: 'page-login-ionic',
  templateUrl: 'login-ionic.html'
})
export class LoginIonicPage {

  constructor(
  public navCtrl: NavController,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public authProvider: AuthProvider,
  public toastCtrl: ToastController,
  public formBuilder: FormBuilder) {

  }

  loginUser(email: string, password: string) 
  {	

	if(!email)
	{
		this.presentToast("Enter email");
                return;
	}

	if(!password)
	{
		this.presentToast("Enter password");
                return;
	}

	this.login(email,password);
  }

  async login(email:string,password:string){

	try{

	    const res = await firebase.auth().signInWithEmailAndPassword(email, password);

	    if(res)
	    {

		this.presentToast("Login Success");

		this.navCtrl.setRoot(MainPage);

	    }

	}catch(e){

		this.presentToast("Enter valid email and password");

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

  goToRegister()
  {

	this.navCtrl.push(RegistrationPage);

  }  

}
