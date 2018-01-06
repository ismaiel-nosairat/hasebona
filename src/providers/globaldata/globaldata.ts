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

  sheet: Sheet;
  members: any[];
  entries: any[];
  report: any;
  creditors: any[] = [];
  debtors: any[] = [];
  creditorsBalance: any[] = [];
  debtorsBalance: any[] = [];

  membersLoadingIsDone;
  entriesLoadingIsDone;
  GC: any;
  globalColorsRGBA: any[];
  globalColorsHEX: any[];

  constructor(public http: Http) {
    console.log('Hello GlobaldataProvider Provider');

    this.membersLoadingIsDone = false;
    this.entriesLoadingIsDone = false;
    this.GC = {
      LOAD_MEMBERS: 'LOAD_MEMBERS',
      LOAD_ENTRIES: 'LOAD_ENTRIES',
      LOAD_REPORT: 'LOAD_REPORT'
    };


    this.globalColorsRGBA = [
      'rgba(255, 0, 0,0.6)',
      'rgba(255, 128, 0,0.6)',
      'rgba(255, 255, 0,0.6)',
      'rgba(64, 255, 0,0.6)',
      'rgba(0, 191, 255,0.6)',
      'rgba(0, 64, 255,0.6)',
      'rgba(128, 0, 255,0.6)',
      'rgba(255, 0, 255,0.6)',
      'rgba(255, 0, 128,0.6)',
      'rgba(204, 102, 0,0.6)',
      'rgba(102, 102, 51,0.6)'

    ];
    this.globalColorsHEX = [
      '#ff0000',
      '#ff8000',
      '#ffff00',
      '#40ff00',
      '#00bfff',
      '#0040ff',
      '#8000ff',
      '#ff00ff',
      '#ff0080',
      '#cc6600',
      '#666633'
    ];

  }

  clearContent(clearMembers) {
    this.creditors = [];
    this.debtorsBalance = [];
    this.creditorsBalance = [];
    this.debtors = [];
    this.report = null;
    this.entries = [];
    if (clearMembers) {
      this.members = [];
    }
    
  }
}
