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

  geocodeLatLng(lati, longi, geocoder, map, infowindow,callback): any {

    var latlng = {lat: lati,lng: longi};
    var resu:any;

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
       
        if (results[0]) {
          //map.setZoom(15);
          //var marker = new google.maps.Marker({
           //     position: latlng,
           //     map: map
          //});
          // console.log(results[0].formatted_address);
          resu = callback(results[0].formatted_address);
          //infowindow.setContent(results[0].formatted_address);
          //infowindow.open(map, marker);

          console.log(resu,"1");

        } else {
              window.alert('No results found');
              
        }

        console.log(resu,"2");

      } else {
            window.alert('Geocoder failed due to: ' + status);
        
      }
      console.log(resu,"3");

    });

    setTimeout(() => {
      console.log(resu,"4");
      return resu;
      // Some more code that executes after 1 second
    }, 1000)

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
    var sourceaddress:any;
    var destiaddress:any;
    var lati = 15.505723;
    var longi = 80.049919;
    var slati:any;
    var dlati:any;
    var slongi:any;
    var dlongi:any;
    var i;

    for(i=0;i<this.allLocations.length;i++)
    {

      var resd = this.allLocations[i].user_id.localeCompare(this.firebaseRecId);
      var ress = this.allLocations[i].user_id.localeCompare(this.firebaseUserId);
      
      if(ress==0)
      {

        slati = this.allLocations[i].latitude;
        slongi = this.allLocations[i].longitude;

      }
      if(resd==0)
      {

        dlati = this.allLocations[i].latitude;
        dlongi = this.allLocations[i].longitude;

      }


    }
    console.log(slati);
    console.log(slongi);
    console.log(dlati);
    console.log(dlongi);

    this.geocodeLatLng(slati,slongi,geocoder, this.map, infowindow,function(addr){
          if(addr){
            // alert(addr);
            sourceaddress = addr;
            console.log(sourceaddress,"s1");
            return addr;
            
          }
          
    });
    this.geocodeLatLng(dlati,dlongi,geocoder, this.map, infowindow,function(addr){
          if(addr){
            // alert(addr);
            destiaddress = addr;
            console.log(destiaddress,"d1");
            return addr;
            
          }
          
    });
    setTimeout(() => {
      // Some more code that executes after 1 second
      console.log(sourceaddress,"s2");
      console.log(destiaddress,"d2");
      this.presentToast(sourceaddress);
      this.calculateAndDisplayRoute(sourceaddress,destiaddress)

    }, 1000)
    /*

    this.nativeGeocoder.reverseGeocode(52.5072095, 13.1452818).then((res: NativeGeocoderReverseResult) => {
      let country = this.toastCtrl.create({
        message: res.countryName,
        duration: 4000
      });
      country.present();
    })
    */

  }

  calculateAndDisplayRoute(souraddres,destaddress)
  {

    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    var map = this.map;
    directionsDisplay.setMap(map);

    directionsService.route({
      origin: souraddres,
      destination: destaddress,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
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
