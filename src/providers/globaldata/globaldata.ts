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

  membersLoadingIsDone;
  entriesLoadingIsDone;
  constructor(public http: Http) {
    console.log('Hello GlobaldataProvider Provider');
      this.membersLoadingIsDone=false;
      this.entriesLoadingIsDone=false;
      

  }

}
