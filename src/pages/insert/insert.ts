import { Component } from '@angular/core';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { NavController, NavParams, } from 'ionic-angular';
import { UserProfilePage } from '../userprofile/userprofile';
import { MainPage } from '../mainpage/mainpage';

@Component({
  selector: 'page-insert',
  templateUrl: 'insert.html'
})
export class InsertPage {

  public firebaseUserId: any;
  public receivedValue: any;

    constructor(private toastCtrl: ToastController,
        public nav:NavController,
        public navParams: NavParams,
        private alertCtrl: AlertController) {

          this.firebaseUserId = firebase.auth().currentUser.uid;  
          this.receivedValue = navParams.get('email_id');
          console.log(this.receivedValue+"insert");
         
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
    if(scroll_height > 96)
      scroll_height = 96;

    // apply new style
    element.style.height      = scroll_height + "px";
    textarea.style.minHeight  = scroll_height + "px";
    textarea.style.height     = scroll_height + "px";
  }
  
  advanceSearch(): any
  {
    let prompt = this.alertCtrl.create({
    title: 'Languages',
    message: 'Select option ',
    inputs : [
    {
        type:'radio',
        label:'Java',
        value:'Java'
    },
    {
        type:'radio',
        label:'Android',
        value:'Android'
    },
    {
      type:'radio',
      label:'TypeScript',
      value:'TypeScript'
    },
    {
      type:'radio',
      label:'Sql',
      value:'Sql'
    },
    {
      type:'radio',
      label:'Angular',
      value:'Angular'
    },
    {
      type:'radio',
      label:'Python',
      value:'Python'
    },
    {
      type:'radio',
      label:'JavaScript',
      value:'JavaScript'
    }],
    buttons : [
    {
        text: "Cancel",
        handler: data => {
        console.log("cancel clicked");
        document.getElementById("language").innerText = "";
        }
    },
    {
        text: "Select",
        handler: data => {
        console.log("search clicked");
        console.log(data);
        document.getElementById("language").innerText = data;
        }
    }]});
    prompt.present();

  }

  submitQuery(query,message){

    var selected = document.getElementById("language").textContent;
    if(!query)
    {
      this.presentToast("Please enter Query");
      return;
    }

    if(!message)
    {
      this.presentToast("Enter some message");
      return;
    }

    if(!selected)
    {
      this.presentToast("Please select language");
      return;
    }

    console.log(query);
    console.log(message);
    console.log(selected);

    var ran = Math.floor(Math.random() * (1000000 - 10 + 1)) + 10;
    var random = ran.toString();

    
  
    // Get a key for a new Post.
    var newPostKey = firebase.database().ref().child('Queries').child(selected).child(random).push().key;
  
    var QueryData = {
      user_id:this.firebaseUserId,
      email:this.receivedValue,
      query: query,
      message: message,
      answers:newPostKey
    };

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['SpeedQueries/'+selected+'/' + newPostKey] = QueryData;
  
    var msgupdates = {};
    msgupdates['Queries/'+newPostKey] = QueryData;

    try{
      firebase.database().ref().update(updates);
      firebase.database().ref().update(msgupdates);
      this.presentToast("Query added");
    }catch(e)
    {
      this.presentToast("please check your internrt connection");
    }

    this.nav.push(MainPage);

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
