import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { MemberdetailsPage } from '../memberdetails/memberdetails';
import { TabsPage } from '../../tabs/tabs';
/**
 * Generated class for the MembersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-members',
  templateUrl: 'members.html',
})
export class MembersPage {
  loading: Loading;
  members: any;
  
  constructor(public navCtrl: NavController,
    public navParams: NavParams, private storage: Storage,
    public backend: BackendProvider, private alertCtrl: AlertController, private gdata: GlobaldataProvider,
    private loadingCtrl: LoadingController) {

    this.members = this.gdata.members;
  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
  }


  ionViewWillEnter(){
    
  }
 

  showMemberDetails(member) {
    this.navCtrl.push(MemberdetailsPage, { member: member });
  }



  validateName(data): boolean {
    console.log(data);
    if (data.name != "")
      return true;
    else
      return false;
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


private addMember() {
  const addMemberAlert = this.alertCtrl.create({
    title: "Create new Member",
    message: "Only letters or numbers, max 32 charachters",
    inputs: [{
      name: "member",
      placeholder: "e.g. 'Oqlaa'",
      type: "text"
    }]
    ,
    buttons: [{
      text: "ADD",
      handler: res => {
        console.log(res.member.trim());
        if (res.member.trim().length > 0 && res.member.trim().length < 50) {
          //this._addBrand(data.brandNname)
          this.showLoading();
          this.backend.newMember(res.member.trim()).subscribe(
            (val) => {
              this.gdata.members.push(JSON.parse(val.text()));
              console.log(this.gdata.members);
              this.loading.dismiss();
              //this.navCtrl.setRoot(TabsPage);
            },
            (err) => {
              this.showError(err);
            }
          );
        } else {
          this._displayAlertEmptyMemberName()
        }//end else
      }
    }]
  })//end addMemberAlert.create
  addMemberAlert.present();
}; //end _displayAlerCreateFirstBrand

private _displayAlertEmptyMemberName() {
  const missingFirstBrandAlert = this.alertCtrl.create({
    title: "Must enter member name",
    message: "Name cannot be empty, and cannot exceed 32 characters",
    buttons: [{
      text: "OK",
      handler: () => {
        this.addMember();
      }
    }]
  }) //end missingFirstBrandAlert.create
  missingFirstBrandAlert.present();
};// end _displayAlertEmptyBrandName










}