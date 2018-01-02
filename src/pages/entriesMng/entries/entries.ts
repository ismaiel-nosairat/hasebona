import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular/components/loading/loading';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { EntrydetailsPage } from '../entrydetails/entrydetails';
import { NewentryPage } from '../newentry/newentry';

/**
 * Generated class for the EntriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entries',
  templateUrl: 'entries.html',
})
export class EntriesPage {
  loading:Loading;
  entries : any[];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private backend:BackendProvider,
    private alertCtrl: AlertController, 
    private gdata: GlobaldataProvider,
    private loadingCtrl: LoadingController
  ) 
  {
    this.entries=this.gdata.entries;
  }

  refreshEntries(){
    this.showLoading();
    this.backend.loadEntries().subscribe(
      (val) => {
        this.gdata.entries = JSON.parse(val.text());
        this.gdata.entries.forEach(e=> {
          e.date = new Date(e.date).toDateString();
          console.log(e.date);
          e.shares.forEach(i => {
            i.member.index = 'custom-' + i.member.id % 5;
        })});
        this.loading.dismiss();
      },
      (err) => {
        this.showError(err);
      }
    );
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad EntriesPage');
  }

  showEntry(item){
    this.navCtrl.push(EntrydetailsPage, {entry:item});
  }

  newEntry(){
    this.navCtrl.push(NewentryPage);
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
    if (text.status === 404) {
      msg = "Not Found";
    }
    else
      msg = text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }


}
