import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { Loading } from 'ionic-angular/components/loading/loading';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

/**
 * Generated class for the MemberbalancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-memberbalance',
  templateUrl: 'memberbalance.html',
})
export class MemberbalancePage {
  member:any;
  loading:Loading;
  report:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private backend :BackendProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.member = navParams.get("member");
    this.backend.getMemberBalance(this.member.id).subscribe(
      val=>{
        console.log(val);
        this.report=JSON.parse(val.text());
        console.log(this.report);
        console.log(this.report.shares);
      },
      err=>{
        this.showError(err);
      }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberbalancePage');
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
