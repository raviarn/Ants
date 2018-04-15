import { Component, ViewChild, ElementRef } from '@angular/core';
import { RegistrationPage } from '../registration/registration';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap,Marker,MarkerOptions } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { LatLng, CameraPosition } from '@ionic-native/google-maps';
import { MainPage } from '../mainpage/mainpage';
import {
  IonicPage,
  Loading,
  LoadingController,
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

  selectloc: any;
  public firebaseUserId: any;
  public firebaserecId: any;
  public username:any;
  public lat:any;
  public lon:any;

  public allLocations: Array<{user_id: string, latitude: string,longitude: string}>;

  @ViewChild('map') mapElement;
  map:any;
  constructor(

    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public http       : Http,
    public nativeGeocoder: NativeGeocoder,
    public navParams: NavParams,private geolocation: Geolocation,public _googleMaps: GoogleMaps) {

      this.firebaseUserId = firebase.auth().currentUser.uid;
      this.selectloc = navParams.get('item');
      this.firebaserecId = this.selectloc.user_id;
      console.log(this.selectloc);
      console.log(this.firebaseUserId);
      console.log(this.firebaserecId);

      this.allLocations = [];

      var starCountRef = firebase.database().ref('Location').orderByChild('latitude');
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
            longitude: everyone.longitude,
          });
          console.log(this.allLocations.length);
          console.log(everyone.latitude);
          console.log(everyone.longitude);
          console.log(everyone.user_id);
          return false; 
        });
      });

  }

  ionViewDidLoad(latitud:string,longitud:string){

    this.initMap();

  }

  mylocation(){

    console.log(this.allLocations.length);

    for(var i = 0;i<this.allLocations.length;i++) { 

      var rep = this.allLocations[i].user_id.localeCompare(this.firebaseUserId);
      if(rep == 0)
      {

        this.lat = this.allLocations[i].latitude;
        this.lon = this.allLocations[i].longitude;
        this.initMap();

      }
    }

  }

  reclocation(){

    console.log(this.allLocations.length);

    for(var i = 0;i<this.allLocations.length;i++) { 

      var rep = this.allLocations[i].user_id.localeCompare(this.firebaserecId);
      if(rep == 0)
      {

        this.lat = this.allLocations[i].latitude;
        this.lon = this.allLocations[i].longitude;

        this.initMap();

      }
    }

  }

  routeus(){

    console.log(this.allLocations.length);

    this.initAllMap();

    /*

    this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818)
        .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
        .catch((error: any) => console.log(error));

        */

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

  initAllMap(){

    let latLng = new google.maps.LatLng(this.lat,this.lon);

    var image = 'assets/imgs/marker.png';

    let mapOptions = {

      center: latLng,
      zoom:15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818)
        .then((result: NativeGeocoderReverseResult) => console.log(JSON.stringify(result)))
        .catch((error: any) => console.log(error));

    var marker1 = new google.maps.Marker({
      position: latLng,
      map: this.map,
      icon: image
    })

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
