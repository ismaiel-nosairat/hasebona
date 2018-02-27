import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular/components/loading/loading';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the EntrydetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-entrydetails',
  templateUrl: 'entrydetails.html',
})
export class EntrydetailsPage {
  entry: any;
  loading: Loading;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public backend: BackendProvider, private alertCtrl: AlertController, public gdata: GlobaldataProvider, private translate: TranslateService,
    private loadingCtrl: LoadingController
  ) {
    this.entry = navParams.get("entry");
    console.log(this.entry);

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntrydetailsPage');
  }

  deleteEntry() {

    this.translate.get('ENTRY_DETAILS.DELETE_ENTRY').subscribe(
      val => {

        const deleteEntryAlert = this.alertCtrl.create({
          title: val.ALET_TITLE,
          message: val.ALET_TEXT,
          inputs: []
          ,
          buttons: [{
            text: val.ALERT_OK,
            handler: res => {
              this.showLoading();
              this.backend.deleteEntry(this.entry).subscribe(
                (res) => {
                  var index = this.gdata.entries.indexOf(this.entry, 0);
                  if (index > -1) {
                    this.gdata.entries.splice(index, 1);
                  }
                  this.navCtrl.pop();
                },
                (err) => {
                  this.showError(err);
                }
              );
            }
          },
          {
            text:val.ALERT_CANCLE,
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
          ]
        });
        deleteEntryAlert.present();
      }
      , err => { });
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
