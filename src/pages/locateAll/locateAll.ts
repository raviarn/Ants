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

  selected: any;
  public firebaseUserId: any;
  public username:any;
  public lat:any;
  public lon:any;

  @ViewChild('map') mapElement;
  map:any;
  constructor(

    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,private geolocation: Geolocation,public _googleMaps: GoogleMaps) {
     

  }

  ionViewDidLoad(){

    this.initMap();

  }

  initMap(){

    let latLng = new google.maps.LatLng(12.9410005,77.5799636);

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
  
  presentToast(value:string) {
    let toast = this.toastCtrl.create({
    message: value,
    duration: 3000,
    position: 'bottom'
    });
    toast.present();
  }

}
