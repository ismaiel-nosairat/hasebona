import { Component, transition } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController, Loading } from 'ionic-angular';

import { Storage } from '@ionic/storage';
import { SignupPage } from '../settingsMng/signup/signup';
import { SigninPage } from '../settingsMng/signin/signin';
import { BackendProvider } from '../../providers/backend/backend';
import { TabsPage } from '../tabs/tabs';
import { GlobaldataProvider } from '../../providers/globaldata/globaldata';
import { TranslateService } from '@ngx-translate/core';


/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, public backend: BackendProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private gdata: GlobaldataProvider, private translate: TranslateService) {
    this.showLoading();
    this.storage.get("sheet").then(
      (res) => {
        if (res != null) {
          this.gdata.sheet = JSON.parse(res);
          this.gdata.sheet.date = new Date(this.gdata.sheet.date).toDateString();
          let methods = [this.gdata.GC.LOAD_MEMBERS, this.gdata.GC.LOAD_ENTRIES, this.gdata.GC.LOAD_REPORT];
          this.backend.loadDataParaller(methods).then(res => {
            console.log(res);
            this.navCtrl.push(TabsPage)
          }).catch((err) => {
            if (err.status == 401) {
              this.loading.dismiss();
            }
            else {
              console.log(err);
              this.showFatalError("Can't connect to Server");
            }

          })
        }
        else {
          console.log(gdata.sheet);
          this.loading.dismiss();
        }
      },
      (err) => {
        this.showFatalError("Cant connect to Local Storage");
        console.log(err);
        console.log(gdata.sheet);
      }
    ).catch(e => {
      this.showError("Cant connect to Local Storage");
      console.log(e);

    })
      ;

  }

  ionViewDidLoad() {


  }
  signup() {
    this.navCtrl.push(SignupPage);
  }

  signin() {
    this.navCtrl.push(SigninPage);
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    console.log(text);
    this.loading.dismiss();
    console.log("To display alert");
    let msg;
    if (text.status === 0) {
      msg = "Error connecting to Server";
    }
    else
      msg = text.status;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }



  showFatalError(text) {
    console.log(text);
    this.loading.dismiss();
    console.log("To display alert");
    let msg = text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  test() {
    if (this.translate.getDefaultLang() == 'en') {
      this.translate.setDefaultLang('ar');
    }
    else{
      this.translate.setDefaultLang('en');
    }
  }

}
