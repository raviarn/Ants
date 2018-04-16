import { Component, ViewChild, ElementRef } from '@angular/core';
import { RegistrationPage } from '../registration/registration';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap,Marker,MarkerOptions } from '@ionic-native/google-maps';
import { LatLng, CameraPosition } from '@ionic-native/google-maps';
import { MainPage } from '../mainpage/mainpage';
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

declare var google:any;

@Component({
  selector: 'page-locateAll',
  templateUrl: 'locateAll.html'
})

export class LocateAllPage {

  selectlocate: any;
  public firebaseUserId: any;
  public firebaseRecId:any;
  public username:any;
  public lat:any;
  public lon:any;

  allLocations: Array<{user_id: string,latitude: string,longitude:string}>;

  @ViewChild('map') mapElement;
  map:any;
  constructor(

    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,private geolocation: Geolocation,public _googleMaps: GoogleMaps) {

      this.selectlocate = navParams.get('item');
      // var emai = "From:"+this.selectedItem;
      console.log(this.selectlocate);

      this.firebaseUserId = firebase.auth().currentUser.uid;
      this.firebaseRecId = this.selectlocate.user_id;
      this.allLocations = [];

      var starCountRef = firebase.database().ref('Location').orderByChild('user_id');
      let familyList: Array<string>;
      starCountRef.on("value",(snapshot) => {
        //console.log('users', snapshot.val());
        var queries = snapshot.val();
        snapshot.forEach((childSnapshot) => {
          var everyone = childSnapshot.val();

          //catched every single child
          //And the added to the list
          this.allLocations.push({
            user_id: everyone.user_id,
            latitude: everyone.latitude,
            longitude:everyone.longitude,
          });
          console.log(this.allLocations.length);
          console.log(everyone.latitude);
          console.log(everyone.longitude); 
          return false; 
        });
      });

  }

  ionViewDidLoad(){

    this.initMap();

  }

  initMap(){

    let latLng = new google.maps.LatLng(this.lat,this.lon);

    var image = 'assets/imgs/marker.png';

    let mapOptions = {

      center: latLng,
      zoom:15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    var marker1 = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: image
    })

  }

  locateMe(){

    console.log(this.allLocations.length);

    var i;

    for(i=0;i<this.allLocations.length;i++)
    {

      var res = this.allLocations[i].user_id.localeCompare(this.firebaseUserId);

      if(res==0)
      {

        this.lat = this.allLocations[i].latitude;
        this.lon = this.allLocations[i].longitude;
        this.initMap();

      }

    }

  }

  locateRec(){

    console.log(this.allLocations.length);

    var i;

    for(i=0;i<this.allLocations.length;i++)
    {

      var res = this.allLocations[i].user_id.localeCompare(this.firebaseRecId);

      if(res==0)
      {

        this.lat = this.allLocations[i].latitude;
        this.lon = this.allLocations[i].longitude;
        this.initMap();

      }

    }
    
  }

  routeUs(){


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
