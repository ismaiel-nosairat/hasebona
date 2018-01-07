import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { Loading } from 'ionic-angular/components/loading/loading';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { EntrydetailsPage } from '../../entriesMng/entrydetails/entrydetails';

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
  member: any;
  loading: Loading;
  report: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private backend: BackendProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController,private gdata:GlobaldataProvider) {
    this.member = navParams.get("member");
    this.backend.getMemberBalance(this.member.id).subscribe(
      val => {
        console.log(val);
        this.report = JSON.parse(val.text());
        if (this.report.balance < 0) {
          this.report.balanceCss = "negative";
        }
        else {
          this.report.balanceCss = "positive";
        }
        this.report.shares.forEach(e => {
          if (e.amount > 0) {
            e.Css = 'positive';
            e.Icon = 'md-arrow-dropup';
          }
          else {
            e.Css = 'negative';
            e.Icon = 'md-arrow-dropdown';
          }
        });
        console.log(this.report);
        console.log(this.report.shares);
      },
      err => {
        this.showError(err);
      }
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberbalancePage');
  }


  entryDetails(item){
    let entryId=item.entryId;
    let entry:any;
    this.gdata.entries.every(e =>{
        console.log(e);
        return (e.id==entryId);
    });
    console.log(entry);
    this.navCtrl.push(EntrydetailsPage, {entry: entry});
    // this.gdata.entries.forEach(e=>{
    //   if (e.id==entryId)
    //     {
    //       entry=e;
    //     }
    // })

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
