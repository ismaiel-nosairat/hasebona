import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AlertController, LoadingController, Loading, } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TabsPage } from '../../tabs/tabs';
import { Storage } from '@ionic/storage';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';

/**
 * Generated class for the SigninPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {
  login = {
    id: '',
    password: ''
  }
  loading: Loading;
  signinForm: FormGroup;
  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private storage: Storage,private gdata: GlobaldataProvider,private fb: FormBuilder) {
    this.signinForm = fb.group({
      'id': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      'password': [null, Validators.compose([Validators.required,Validators.minLength(3), Validators.maxLength(50) ])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }
  signin(value) {
    this.showLoading();
    let login={
      id:value.id,
      password:value.password
    };
    this.backend.signin(login).subscribe(
      (value) => {
        console.log(value.text());
        //this.storage.set("sheet", JSON.stringify(value.text()));
        this.storage.set("sheet", value.text());
        this.gdata.sheet =JSON.parse(value.text());
        this.backend.loadDataSync().then(()=>{
          this.navCtrl.setRoot(TabsPage);
        }).catch((err)=>{
          this.showFatalError("Error while contacting Server");
        })
        ;
        
      },
      (err) => {
        let x=JSON.stringify(err)
        console.log(x);
        console.log(err.status);
        if (err.status==401){
          this.showFatalError("Wrong id or password");
        }
        else{
        this.showFatalError("Error while contacting Server");
        }
        
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
    let msg;
    if (text.status=== 404){
      msg="Not Found";
    }
    else
    msg=text;
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
    let msg=text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }  


}


