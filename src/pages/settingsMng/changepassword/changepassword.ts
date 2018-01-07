import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { BackendProvider } from '../../../providers/backend/backend';
import { Loading } from 'ionic-angular/components/loading/loading';
import { Storage } from '@ionic/storage/dist/storage';
/**
 * Generated class for the ChangepasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepassword',
  templateUrl: 'changepassword.html',
})
export class ChangepasswordPage {
  loading: Loading;
  passwordChangeForm: FormGroup;
  constructor(private backend: BackendProvider, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private gdata: GlobaldataProvider, private fb: FormBuilder,private storage :Storage) {
    this.passwordChangeForm = fb.group({
      'currentPassword': [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      'confirmPassword': ['', Validators.required],
      'newViewPassword': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
    }, { validator: this.matchingPasswords('newPassword', 'confirmPassword') });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
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
    console.log('ionViewDidLoad ChangepasswordPage');
  }
  passwordChange(value) {
    if (value.currentPassword != this.gdata.sheet.password) {
      let alert = this.alertCtrl.create({
        title: 'Bad Input',
        subTitle: 'Current password you\'ve entered is not correct ',
        buttons: ['OK']
      });
      alert.present();
    }else{
      this.showLoading();
      this.backend.updateSheet(value).subscribe(
        val=>{
        this.storage.set("sheet", val.text());
        let newSheet= JSON.parse(val.text());
        this.gdata.sheet.password=newSheet.password; 
        this.gdata.sheet.viewPassword=newSheet.viewPassword;
        this.navCtrl.pop();
        },
        err=>{
          console.log(err);
          this.showError(err);
        }
      );

      
    }

     console.log(value);
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
