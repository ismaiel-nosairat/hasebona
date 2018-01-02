import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController, LoadingController, Loading, } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';

/**
 * Generated class for the MemberdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-memberdetails',
  templateUrl: 'memberdetails.html',
})
export class MemberdetailsPage {
  loading: Loading;
  entries: any[];
  member: any;
  c: string = 'custom-icon';
  constructor(public navCtrl: NavController, public navParams: NavParams, private backend: BackendProvider, private gdata: GlobaldataProvider, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {
    this.member = navParams.get("member");
    this.showLoading();
    this.backend.memberEntries(this.member).subscribe(
      (val) => {
        this.entries = JSON.parse(val.text());
        this.entries.forEach(e => {
          e.date = new Date(e.date).toDateString();
          e.shares.forEach(i => {
            i.member.index = 'custom-' + i.member.id % 5;
          });
        });

        console.log(this.entries);
        this.loading.dismiss();
      },
      (err) => {
        this.navCtrl.pop();
        this.showError(err);

      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MemberdetailsPage');

  }


  deleteMember() {
    this.showLoading();
    this.backend.deleteMember(this.member).subscribe(
      (res) => {
        var index = this.gdata.members.indexOf(this.member, 0);
        if (index > -1) {
          this.gdata.members.splice(index, 1);
        }
        this.navCtrl.pop();
      },
      (err) => { 
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
    this.loading.dismiss();
    let msg = text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }




}








// var time = new Date(e.date).getTime();
          // var date = new Date(time);
          // e.date=date.toString();
          // console.log(e.date);
          //e.date=new Date(e.date).toLocaleDateString();