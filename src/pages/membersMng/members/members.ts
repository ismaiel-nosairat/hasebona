import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BackendProvider } from '../../../providers/backend/backend';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { MemberdetailsPage } from '../memberdetails/memberdetails';
import { TabsPage } from '../../tabs/tabs';
import { MemberbalancePage } from '../memberbalance/memberbalance';
import { TranslateService } from '@ngx-translate/core';
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
    private loadingCtrl: LoadingController,private translate:TranslateService) {

    this.members = this.gdata.members;
  

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MembersPage');
  }


  ionViewWillEnter(){
    
  }
 

  showMemberDetails(member) {
    this.navCtrl.push(MemberbalancePage, { member: member });
    // this.backend.getMemberBalance(member.id).subscribe(
    //   val=>{
    //     console.log(val);
    //     let balanceReport=JSON.parse(val.text());
    //     console.log(balanceReport);
    //     console.log(balanceReport.shares);
    //     this.navCtrl.push(MemberbalancePage, { member: member, balanceReport:balanceReport });
    //   },
    //   err=>{
    //     this.showError(err);
    //   }
    // );
    
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

  this.translate.get('MEMBERS.ALERT_ADD_MEMBER').subscribe(
    val => {


      const addMemberAlert = this.alertCtrl.create({
        title: val.TITLE,
        message: val.MESSAGE,
        inputs: [{
          name: val.INPUTS.NAME,
          placeholder: val.INPUTS.PLACEHOLDER,
          type: "text"
        }]
        ,
        buttons: [{
          text: val.BUTTONS.TEXT,
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
              this._displayAlertEmptyMemberName(val)
            }//end else
          }
        }]
      })//end addMemberAlert.create
      addMemberAlert.present();
    });
     //end _displayAlerCreateFirstBrand
    
      


    }
  




private _displayAlertEmptyMemberName(val) {
  const missingFirstBrandAlert = this.alertCtrl.create({
    title: val.ERRORS.TITLE,
    message: val.ERRORS.MESSAGE,
    buttons: [{
      text: val.ERRORS.TEXT,
      handler: () => {
        this.addMember();
      }
    }]
  }) //end missingFirstBrandAlert.create
  missingFirstBrandAlert.present();
};// end _displayAlertEmptyBrandName










}