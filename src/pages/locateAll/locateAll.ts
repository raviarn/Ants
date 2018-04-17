import { Component, ViewChild, ElementRef } from '@angular/core';
import { RegistrationPage } from '../registration/registration';
import firebase from 'firebase';
import { ToastController } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { GoogleMaps, GoogleMap,Marker,MarkerOptions } from '@ionic-native/google-maps';
import { LatLng, CameraPosition } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
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
  testingparams : any;
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
    public navParams: NavParams,private geolocation: Geolocation,public _googleMaps: GoogleMaps,public nativeGeocoder: NativeGeocoder) {

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

  geocodeLatLng(geocoder, map, infowindow,callback): any {

    var latlng = {lat: 15.505723,lng: 80.049919};
    var resu:any;

    return geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
       
        if (results[0]) {
          map.setZoom(15);
          var marker = new google.maps.Marker({
                position: latlng,
                map: map
          });
          // console.log(results[0].formatted_address);
          callback(results[0].formatted_address);
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);

        } else {
              window.alert('No results found');
              
        }

      } else {
            window.alert('Geocoder failed due to: ' + status);
        
      }

    });
    
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

    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;

    this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818).then((res: NativeGeocoderReverseResult) => {
      let country = this.toastCtrl.create({
        message: res.countryName,
        duration: 4000
      });
      country.present();
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
