import { Component } from '@angular/core';

import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { MembersPage } from '../membersMng/members/members'
import { GlobaldataProvider } from '../../providers/globaldata/globaldata';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { EntriesPage } from '../entriesMng/entries/entries';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = MembersPage;
  tab5Root = EntriesPage;
  
  constructor() {
   // this.backend.loadData();
  }

  
}

