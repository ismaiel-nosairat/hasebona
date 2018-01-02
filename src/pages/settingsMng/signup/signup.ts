import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading, } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { Sheet } from '../../../models/Sheet';
import { TabsPage } from '../../tabs/tabs';
import {Http} from '@angular/http';
import {Storage} from '@ionic/storage'; 
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  loading: Loading;
  sheet1 = {
    id: '',
    name: '',
    desc: '',
    password: '',
    viewPassword: '',
    date: ''
  };
  sheet: Sheet;

  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController,private storage:Storage,private gdata: GlobaldataProvider) {
    this.sheet = {
      id: '',
      name: '',
      password: '',
      viewPassword: '',
      date: ''
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  
  signup() {
    
    this.showLoading();    
    this.backend.signup(this.sheet).subscribe(
      (value) => {
        console.log(value);
        this.storage.set("sheet",JSON.stringify(value));
        this.gdata.sheet=value.json();
        this.navCtrl.setRoot(TabsPage);
      },
      (err) => { 
        this.showError(err);
      }
    )


  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    console.log("To stop and show errro");
    this.loading.dismiss();
    console.log("To display alert");
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
