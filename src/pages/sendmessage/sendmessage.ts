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
  NavParams,
  AlertController,
} from 'ionic-angular';

import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { AuthProvider } from '../../providers/auth/auth';
import { MainPage } from '../mainpage/mainpage';
import { AnswerHerePage } from '../answerhere/answerhere';

@Component({
  selector: 'page-sendmessage',
  templateUrl: 'sendmessage.html'
})
export class SendMessagePage {

  selecter: any;
  public firebaseusr_id:any;

  constructor(
  public navCtrl: NavController,
  public loadingCtrl: LoadingController,
  public alertCtrl: AlertController,
  public authProvider: AuthProvider,
  public toastCtrl: ToastController,
  public navParams: NavParams,
  public formBuilder: FormBuilder) {

    this.selecter = navParams.get('item');
    // var emai = "From:"+this.selectedItem;
    console.log(this.selecter);

    this.firebaseusr_id = firebase.auth().currentUser.uid;
    
  }

  change() {
    // get elements
    var element   = document.getElementById('messageInputBox');
    var textarea  = element.getElementsByTagName('textarea')[0];

    // set default style for textarea
    textarea.style.minHeight  = '0';
    textarea.style.height     = '0';

    // limit size to 96 pixels (6 lines of text)
    var scroll_height = textarea.scrollHeight;
    if(scroll_height > 320)
      scroll_height = 320;

    // apply new style
    element.style.height      = scroll_height + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";
  }

  sendmyMessage(Msg){

    if(!Msg)
    {

        this.presentToast("Enter Message");
        return;

    }

    var sender = firebase.auth().currentUser;

    var ran = Math.floor(Math.random() * (1000000 - 10 + 1)) + 10;
      var random = ran.toString();
      
      var MessageData = {
        email:sender.email,
        message:Msg,
        sender_id:this.firebaseusr_id,
      };

      var messageupdates = {};
      messageupdates['Messages/'+this.selecter.user_id+'/'+random] = MessageData;

      try{
        firebase.database().ref().update(messageupdates);
        this.presentToast("Message sent successfully");
      }catch(e)
      {
        this.presentToast("please check your internrt connection");
      }

      this.navCtrl.setRoot(MainPage);

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
