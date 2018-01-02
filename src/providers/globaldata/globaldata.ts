import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Sheet } from '../../models/Sheet';

/*
  Generated class for the GlobaldataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GlobaldataProvider {

  sheet :Sheet;
  members:any[];
  entries:any[];
  report:any;
  creditors:any[]=[];
  debtors:any[]=[];
  creditorsBalance:any[]=[];
  debtorsBalance:any[]=[];

  membersLoadingIsDone;
  entriesLoadingIsDone;
  GC:any;
  constructor(public http: Http) {
    console.log('Hello GlobaldataProvider Provider');
      this.membersLoadingIsDone=false;
      this.entriesLoadingIsDone=false;
      this.GC={
        LOAD_MEMBERS:'LOAD_MEMBERS',
        LOAD_ENTRIES:'LOAD_ENTRIES',
        LOAD_REPORT:'LOAD_REPORT'
      };

  }

}
