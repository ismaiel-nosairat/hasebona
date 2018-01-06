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
  deleteEntryUri: string;
  memberEntriesUri: any;
  signupUri;
  clearUri;
  deleteUri;
  signinUri;
  membersListUri;
  entriesListUri;
  newEntryUri;
  reportUri;
  serverhost;
  options;

  constructor(public http: Http, private gdata: GlobaldataProvider) {
    this.serverhost = 'http://localhost:8080';
    this.signupUri = '/sheets/signup';
    this.signinUri = '/sheets/signin';
    this.clearUri = '/sheets/clear';
    this.deleteUri = '/sheets/delete';
    this.reportUri = '/sheets/report';
    this.membersListUri = '/members/list';
    this.entriesListUri = '/entries/list';
    this.memberEntriesUri = '/members/details';
    this.newMemberUri = '/members/add';
    this.deleteMemberUri = '/members/delete';
    this.newEntryUri = '/entries/add';
    this.deleteEntryUri = '/entries/delete';
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

  // -----------< Sheets >---------------------

  signup(sheet) {
    let url = this.serverhost + this.signupUri;
    return this.http.post(url, sheet);
  }

  signin(login) {
    let url = this.serverhost + this.signinUri;
    return this.http.post(url, login);
  }

  clearSheet(){
    let url = this.serverhost + this.clearUri;
    let sh = {
      id: this.gdata.sheet.id,
      password: this.gdata.sheet.password,
      viewPassword: this.gdata.sheet.viewPassword
    };
    return this.http.post(url,sh,this.options);
  }

  deleteSheet(){
    let url = this.serverhost + this.deleteUri;
    let sh = {
      id: this.gdata.sheet.id,
      password: this.gdata.sheet.password,
      viewPassword: this.gdata.sheet.viewPassword
    };
    return this.http.post(url,sh,this.options);
  }

  ///////////////////////////////////////////////

  // -----------< Members>---------------------


  membersList(sheet) {
    let url = this.serverhost + this.membersListUri;
    return this.http.post(url, { id: sheet.id, password: sheet.password, viewPassword: sheet.viewPassword }, this.options);
  }

  newMember(data) {
    console.log('To save new member with name:' + data);
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

  ///////////////////////////////////////////////////////




  // -----------< Entries >---------------------
  loadEntries() {
    let url = this.serverhost + this.entriesListUri;
    return this.http.post(url, this.gdata.sheet, this.options);
  }

  newEntry(entry) {
    console.log('To save entry');
    let url = this.serverhost + this.newEntryUri;
    let sent = entry;
    return this.http.post(url, sent, this.options);
  }

  deleteEntry(entry) {
    console.log('To delete entry');
    let url = this.serverhost + this.deleteEntryUri;
    let sent = {
      id: entry.id,
      sheet: {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password
      }
    };
    return this.http.post(url, sent, this.options);
  }

  //////////////////////////////////////////////////




  loadDataSync(): Promise<any> {
    return new Promise((resolve, reject) => {
      //  Getting Entities ...........
      let url = this.serverhost + this.entriesListUri;
      this.http.post(url, this.gdata.sheet, this.options).subscribe(
        (val) => {
          this.gdata.entries = JSON.parse(val.text());
          this.gdata.entries.forEach(e => {
            e.date = new Date(e.date).toDateString();
            console.log(e.date);
            e.shares.forEach(i => {
              i.member.index = 'custom-' + i.member.id % 5;
            })
          });
          console.log(this.gdata.entries);

          //  Getting Members ...........
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





  loadDataParaller(types): Promise<any> {
    let methods: any[] = [];
    if (types) types.forEach(t => {
      switch (t) {
        case this.gdata.GC.LOAD_MEMBERS: {
          methods.push(this.loadMembersOnlyWithPromise());
          break;
        }
        case this.gdata.GC.LOAD_ENTRIES: {
          methods.push(this.loadEntriesOnlyWithPromise());
          break;
        }
        case this.gdata.GC.LOAD_REPORT: {
          methods.push(this.loadReportOnlyWithPromise());
          break;
        }
        default: {
          console.log("Invalid choice");
          break;
        }
      }
    });


    return new Promise((resolve, reject) => {
      Promise.all(methods).then(
        (values) => {
          console.log(values);
          resolve();
        },
        (err) => {
          console.log(err);

          reject(err);
        }
      ).catch(err => {
        console.log(err);

        reject(err);
      })

    });
    // .catch(err => {
    //   console.log(err);
    //   //reject(err);
    // }
    //   );

  }

  loadEntriesOnlyWithPromise(): Promise<any> {
    let url = this.serverhost + this.entriesListUri;
    return new Promise((resolve, reject) => {
      let s = {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password,
        viewPassword: this.gdata.sheet.viewPassword
      };
      this.http.post(url, s, this.options).subscribe(
        (val) => {
          console.log(val);
          this.gdata.entries = JSON.parse(val.text());
          this.gdata.entries.forEach(e => {
            e.date = new Date(e.date).toDateString();
            e.shares.forEach(i => {
              i.member.index = 'custom-' + i.member.id % 5;
            })
          });
          console.log(this.gdata.entries);
          resolve('Done Entries');
        },
        (err) => {
          console.log("Error in loadEntriesOnlyWithPromise");
          reject(err);
        }
      );
    });
  }

  loadMembersOnlyWithPromise(): Promise<any> {
    let url = this.serverhost + this.membersListUri;
    return new Promise((resolve, reject) => {
      let s = {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password,
        viewPassword: this.gdata.sheet.viewPassword
      };
      this.http.post(url, s, this.options).subscribe(
        (val) => {
          
          this.gdata.members = JSON.parse(val.text());
          console.log(this.gdata.members);
          resolve("Done Members");
        },
        (err) => {
          console.log("Error in loadMembersOnlyWithPromise");
          reject(err);
        }
      );
    });
  }


  loadReportOnlyWithPromise(): Promise<any> {
    let url = this.serverhost + this.reportUri;
    return new Promise((resolve, reject) => {
      let s = {
        id: this.gdata.sheet.id,
        password: this.gdata.sheet.password,
        viewPassword: this.gdata.sheet.viewPassword
      };
      this.http.post(url,s, this.options).subscribe(
        (val) => {
          //console.log(val);
          this.gdata.report = JSON.parse(val.text());
          //console.log(this.gdata.report);
          if (this.gdata.report.balances.length > 0) {
            let index = 0;
            let report = this.gdata.report;
            let creditors: any[] = [];
            let debtors: any[] = [];
            let creditorsBalance: any[] = [];
            let debtorsBalance: any[] = [];
            report.members.forEach(m => {
              if (report.balances[index] > 0) {
                creditors.push(m);
                creditorsBalance.push(report.balances[index]);
              }
              else if (report.balances[index] < 0) {
                debtors.push(m);
                debtorsBalance.push(-1 * report.balances[index]);
              }
              index++;
            });
            this.gdata.creditors = creditors
            this.gdata.debtors = debtors;
            this.gdata.creditorsBalance = creditorsBalance;
            this.gdata.debtorsBalance = debtorsBalance;
            console.log(this.gdata.report);
            console.log(this.gdata.creditors);
            console.log(this.gdata.creditorsBalance);
            console.log(this.gdata.debtors);
            console.log(this.gdata.debtorsBalance);


          }
          resolve("Done report");

        },
        (err) => {
          console.log("Error in loadReportOnlyWithPromise");
          reject(err);
        }
      );
    });
  }



  generateColorsRGBA(num, shift): any[] {
    let returnedArr: any[] = [];
    for (let i = 0; i < num; i++) {
      returnedArr.push(this.gdata.globalColorsRGBA[((i + shift) % this.gdata.globalColorsRGBA.length)]);
    }
    return returnedArr;
  }

  generateColorsHEX(num, shift): any[] {
    let returnedArr: any[] = [];
    for (let i = 0; i < num; i++) {
      returnedArr.push(this.gdata.globalColorsHEX[((i + shift) % this.gdata.globalColorsHEX.length)]);
    }
    return returnedArr;
  }


}












