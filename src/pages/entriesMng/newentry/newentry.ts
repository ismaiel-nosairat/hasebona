import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BackendProvider } from '../../../providers/backend/backend';
import { GlobaldataProvider } from '../../../providers/globaldata/globaldata';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { EntriesPage } from '../entries/entries';

@Component({
  selector: 'page-newentry',
  templateUrl: 'newentry.html',
})
export class NewentryPage {

  newEntryForm: FormGroup;

  entry: any;
  members: any[];
  ckList: any[];
  isCheckedForDebetors: boolean;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder
    , private backend: BackendProvider,
    private alertCtrl: AlertController,
    private gdata: GlobaldataProvider,
    private loadingCtrl: LoadingController
  ) {
    this.isCheckedForDebetors = true;

    this.members = gdata.members;
    this.entry = {
      id: '',
      name: '',
      amount: '',
      creditor: {
        id: ''
      },
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password
      },
      shares: []
    }

    this.ckList = [];

    this.initCkList();
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    this.newEntryForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(1), Validators.maxLength(50)])],
      'amount': ['0', Validators.compose([Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')])],
      'date': [localISOTime, Validators.required],
      'creditor': [null, Validators.required],
      'debetors': [null, Validators.required]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    console.log(this.ckList.length);

  }


  submitForm(x: any): void {
    console.log('Form submitted!');
    console.log(x);
    let debetors: any[];
    let debetorsNumber = this.calculateDebetorsNumber();
    console.log(debetorsNumber);

    // let amount = x.amount/debetorsNumber;
    // let date=x.date;
    // let creditor={
    //   id:x.creditor
    // };
    // let sheet={
    //   id:this.gdata.sheet.id,
    //   password:this.gdata.sheet.password
    // };
    // let shares:any[]=[];

    let myEntry = {
      amount: x.amount,
      date: x.date,
      creditor: {
        id: x.creditor
      },
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password
      },
      shares: []
    };
    let divi: number = -1 * (x.amount / debetorsNumber);
    console.log(divi);
    this.ckList.forEach(c => {
      if (c.isChecked == true || c.id == x.creditor) {
        let m = divi;
        if (c.id == x.creditor) {
          m = divi + myEntry.amount;
          console.log(m);
        }
        let y = {
          amount: m,
          member: {
            id: c.id
          }
        }

        myEntry.shares.push(y);
      }
    });
    console.log(myEntry);
  }

  calculateDebetorsNumber() {
    let count: number = 0;
    this.ckList.forEach(e => { if (e.isChecked == true) count++; });
    return count;
  }

  initCkList() {

    this.members.forEach(e => {
      this.ckList.push(
        {
          id: e.id,
          name: e.name,
          isChecked: true
        }
      )
    });
    console.log(this.members);
    console.log(this.ckList);
  }


  report() {
    let found = 0;
    this.ckList.forEach(c => {
      if (c.isChecked === true) {
        found = 1;
        return;
      }
    });
    if (found == 1) {
      this.isCheckedForDebetors = true;
    }
    else {
      this.isCheckedForDebetors = false;
    }
  }



  submitForm1(x: any): void {
    this.showLoading();
    console.log('Form submitted!');
    let debetors: any[];
    let debetorsNumber = this.calculateDebetorsNumber();

    let myEntry = {
      name: x.name,
      amount: x.amount,
      date: x.date,
      creditor: {
        id: x.creditor
      },
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password
      },
      shares: []
    };
    let division: number = -1 * (x.amount / debetorsNumber);
    let CisD = false;
    this.ckList.forEach(c => {
      console.log('processing member with id=' + c.id);
      if (c.id == x.creditor && c.isChecked == true) {
        CisD = true;
        console.log('this member is the creditor');
      }
      if (c.isChecked == true) {
        console.log('this member is debetor ');
        let realDivision: number = division;
        console.log('real divi for him=' + realDivision);
        console.log('to Check for CD with:' + c.id + ' ' + x.creditor);
        if (c.id == x.creditor) {
          console.log(division);
          console.log(x.amount);
          realDivision = division + Number(x.amount);
          console.log(realDivision);
          console.log('this is creditor and debetor, and this share =' + realDivision);
        }
        let y = {
          amount: realDivision,
          member: {
            id: c.id
          }
        }
        console.log('to put data of this debetor: ' + y);
        myEntry.shares.push(y);
      }
    });
    if (CisD == false) {
      console.log('Here Creditor is not a debetor');
      let temp = {
        amount: x.amount,
        member: {
          id: x.creditor
        }
      };
      console.log('to put data for unique Creditor' + temp);
      myEntry.shares.push(temp);
    }

    console.log(myEntry);
    this.backend.newEntry(myEntry).subscribe(
      res => {
        this.backend.loadDataSync().then(
          (res) => {
            this.navCtrl.setRoot(EntriesPage);    
          },
          (err) => {
            console.log('errrrrrrrrrrrrrrrrror' + err);
            this.showError(err);
          }

        )
      },
      err => {
        this.showError(err);
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

    let msg = text;
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }














}