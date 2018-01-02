import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Headers, RequestOptions } from '@angular/http';
import { Loading } from 'ionic-angular/components/loading/loading';
import { GlobaldataProvider } from '../globaldata/globaldata';

/*
  Generated class for the BackendProvider provider.

  S  newMember(arg0: any): any {
    throw new Error("Method not implemented.");
  }
ee https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BackendProvider {
  newMemberUri: string;
  deleteMemberUri: string;
  deleteEntryUri:string;
  memberEntriesUri: any;
  signupUri;
  signinUri;
  membersListUri;
  entriesListUri;
  newEntryUri;
  serverhost;
  options;

  constructor(public http: Http, private gdata: GlobaldataProvider) {
    this.serverhost = 'http://localhost:8080';
    this.signupUri = '/sheets/signup';
    this.signinUri = '/sheets/signin';
    this.membersListUri = '/members/list';
    this.entriesListUri = '/entries/list';
    this.memberEntriesUri = '/members/details';
    this.newMemberUri = '/members/add';
    this.deleteMemberUri = '/members/delete';
    this.newEntryUri='/entries/add';
    this.deleteEntryUri='/entries/delete';
    console.log('Hello BackendProvider Provider');
    this.gdata.sheet = {
      id: '',
      name: '',
      password: '',
      viewPassword: '',
      date: ''
    };

    let headers = new Headers(
      {
        'Content-Type': 'application/json'
      });
    this.options = new RequestOptions({ headers: headers });


  }


  signup(sheet) {
    let url = this.serverhost + this.signupUri;
    return this.http.post(url, sheet);
  }

  signin(login) {
    let url = this.serverhost + this.signinUri;
    return this.http.post(url, login);
  }

  membersList(sheet) {
    let url = this.serverhost + this.membersListUri;
    return this.http.post(url, sheet);
  }

  loadData() {
    this.loadMembers();
    this.loadEntries();
  }

  loadMembers() {
    let url = this.serverhost + this.membersListUri;
    this.http.post(url, this.gdata.sheet, this.options).subscribe(
      (val) => {
        this.gdata.members = JSON.parse(val.text());
        console.log(this.gdata.members);

      },
      (err) => {

      }
    );

  }
  loadEntries() {
    let url = this.serverhost + this.entriesListUri;
    return this.http.post(url, this.gdata.sheet, this.options);
  }

  loadDataSync(): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.serverhost + this.entriesListUri;
      this.http.post(url, this.gdata.sheet, this.options).subscribe(
        (val) => {
          this.gdata.entries = JSON.parse(val.text());
          this.gdata.entries.forEach(e=> {
            e.date = new Date(e.date).toDateString();
            console.log(e.date);
            e.shares.forEach(i => {
              i.member.index = 'custom-' + i.member.id % 5;
          })});
          console.log(this.gdata.entries);
          let url2 = this.serverhost + this.membersListUri;
          this.http.post(url2, this.gdata.sheet, this.options).subscribe(
            (val) => {
              this.gdata.members = JSON.parse(val.text());
              console.log(this.gdata.members);
              resolve('done');
            },
            (err) => {
              reject('error');
            })
        },
        (err) => { reject('error'); })

    });
  }


  memberEntries(member) {
    let url = this.serverhost + this.memberEntriesUri;
    let sent = {
      id: member.id,
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password,
        viewPassword: this.gdata.sheet.viewPassword
      }
    }
    return this.http.post(url, sent, this.options);
  }




  showLoading(loading, loadingCtrl) {
    loading = loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    loading.present();
  }

  dismissLoading(loading: Loading) {
    loading.dismiss();
  }



  showError(text, loading, alertCtrl) {
    console.log("To stop and show errro");
    loading.dismiss();
    console.log("To display alert");
    let msg;
    if (text.status === 404) {
      msg = "Not Found";
    }
    else
      msg = text;
    let alert = alertCtrl.create({
      title: 'Fail',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  newMember(data) {
    console.log('To save new member with name:'+data);
    let url = this.serverhost + this.newMemberUri;
    let sent = {
      name: data,
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password
      }
    }
    return this.http.post(url, sent, this.options);
  }

  deleteMember(data) {
    let url = this.serverhost + this.deleteMemberUri;
    let sent = {
      id: data.id,
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password
      }
    }
    return this.http.post(url, sent, this.options);
  }

  newEntry(entry){
    console.log('To save entry');
    let url = this.serverhost + this.newEntryUri;
    let sent = entry;
    return this.http.post(url, sent, this.options);
  }
  deleteEntry(entry){
    console.log('To delete entry');
    let url = this.serverhost + this.deleteEntryUri;
    let sent = {
      id:entry.id,
      sheet:{
        id:this.gdata.sheet.id,
        password:this.gdata.sheet.password
      }
    };
    return this.http.post(url, sent, this.options);
  }
} 
