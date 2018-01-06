import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { BackendProvider } from '../../../providers/backend/backend';
import { Storage } from '@ionic/storage';
import { WelcomePage } from '../../welcome/welcome';
import { Loading } from 'ionic-angular/components/loading/loading';
/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  loading: Loading;
  sheet: any;
  public type = 'password';
  public typeView = 'password';
  public showPass = false;
  public showViewPass = false;

  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, private gdata: GlobaldataProvider) {
    this.sheet = gdata.sheet;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  showPassword() {
    this.showPass = !this.showPass;

    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }
  showViewPassword() {
    this.showViewPass = !this.showViewPass;

    if (this.showViewPass) {
      this.typeView = 'text';
    } else {
      this.typeView = 'password';
    }
  }


  logout() {
    this.showLoading();
    this.storage.set('sheet', null).then(res => {
      this.gdata.sheet = null;
      //--->  To Hide the Tabs
      let elements = document.querySelectorAll(".tabbar");
      if (elements != null) {
        Object.keys(elements).map((key) => {
          elements[key].style.display = 'none';
        });
      }
      //........
      this.navCtrl.setRoot(WelcomePage);
    }).catch(ex => {
      this.showError(ex);
    });
  }

  clearSheet(){
    this.showLoading();
    this.backend.clearSheet().subscribe(res=>{
        this.gdata.clearContent(false);
        this.loading.dismiss(); 
    },
    err=>{
      this.showError(err);
    }
  );
  }

  deleteSheet(){
    this.showLoading();
    this.backend.deleteSheet().subscribe(res=>{
        this.storage.clear().then(res=>{
          this.gdata.clearContent(true);
        this.gdata.sheet = null;
        //--->  To Hide the Tabs
        let elements = document.querySelectorAll(".tabbar");
        if (elements != null) {
          Object.keys(elements).map((key) => {
            elements[key].style.display = 'none';
          });
        }
        //........
        this.navCtrl.setRoot(WelcomePage);
        }).catch(err=>{
          this.showError(err);    
        });   
        
    },
    err=>{
      this.showError(err);
    }
  );
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

  showConfirm(x) {
    let msgs=[
      'Are you sure, this will clear all  entries of the Sheet?',
      'Are you sure, this will delete all you data?'
    ];
    let titles=[
      'Delete Sheet?',
      'Clear Entries'
    ]   ;
    let confirm = this.alertCtrl.create({
      title: titles[x],
      message: msgs[x],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
           
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            switch(x){
              case 0:{
                this.clearSheet();
                break;
              }
              case 1:{
                this.deleteSheet();
                break;
              }
              default:{
                console.log("Invalid choose");
              }
            }
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

  test(x){
    console.log(x);

  }

}
