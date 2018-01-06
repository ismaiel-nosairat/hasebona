import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { Sheet } from '../../../models/Sheet';
import { TabsPage } from '../../tabs/tabs';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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

  signupForm: FormGroup;

  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage, private gdata: GlobaldataProvider, private fb: FormBuilder) {
    this.sheet = {
      id: '',
      name: '',
      password: '',
      viewPassword: '',
      date: ''
    };

    this.signupForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }


  signup(value) {

    this.showLoading();
    let signup = {
      name: value.name,
      password: value.password
    };
    this.backend.signup(signup).subscribe(
      (value) => {
        console.log(value);
        this.storage.set("sheet", value.text());
        this.gdata.sheet = JSON.parse(value.text());
        this.gdata.sheet.date = new Date(this.gdata.sheet.date).toDateString();
        ////////////
        let methods = [this.gdata.GC.LOAD_MEMBERS, this.gdata.GC.LOAD_ENTRIES, this.gdata.GC.LOAD_REPORT];
        this.backend.loadDataParaller(methods).then(res => {
          this.loading.dismiss();
          this.navCtrl.setRoot(TabsPage);
        },
          (err) => {
            this.showError(err);
          }
        ).catch(e => this.showError(e));
      },
      (err) => {
        console.log(err);
        console.log(err.status);
        this.showError("Error while contacting Server");
      });
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
