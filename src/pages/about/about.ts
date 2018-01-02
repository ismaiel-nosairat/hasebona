import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BackendProvider } from '../../providers/backend/backend';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { GlobaldataProvider } from '../../providers/globaldata/globaldata';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  newEntryForm: FormGroup;

  entry: any;
  members: any[];
  ckList: any[];
  debetors: any[];
  isCheckedForDebetors: boolean;

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
    this.debetors = [];
    this.initCkList();

    this.newEntryForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(60)])],
      'amount': ['0', Validators.compose([Validators.required, Validators.pattern('^[0-9]*\.?[0-9]+$')])],
      'creditor': [null, Validators.required],
      'debetors': [null, Validators.required]
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    console.log(this.ckList.length);

  }


  submitForm(value: any): void {
    console.log('Form submitted!')
    console.log(value);
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
    let found =0;
    this.ckList.forEach(c => {
      console.log(c.isChecked);
      if (c.isChecked === true){
        console.log("match:"+c.isChecked+" "+true);
        found = 1;
        return;}
    });
    console.log(found);
    if (found==1){
    
      this.isCheckedForDebetors = true;
    }
    else{
      console.log(found);
      this.isCheckedForDebetors = false;
    }
    console.log(this.ckList);
    console.log(this.isCheckedForDebetors);

  }
}