import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MembersPage } from '../pages/membersMng/members/members'
import { WelcomePage } from '../pages/welcome/welcome';
import { SigninPage } from '../pages/settingsMng/signin/signin';
import { SignupPage } from '../pages/settingsMng/signup/signup';
import { BackendProvider } from '../providers/backend/backend';
import { GlobaldataProvider } from '../providers/globaldata/globaldata';
import { MemberdetailsPage } from '../pages/membersMng/memberdetails/memberdetails';
import { NewentryPage } from '../pages/entriesMng/newentry/newentry';
import { EntriesPage } from '../pages/entriesMng/entries/entries';
import { EntrydetailsPage } from '../pages/entriesMng/entrydetails/entrydetails';





@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    SigninPage,
    SignupPage,
    MembersPage,
    MemberdetailsPage,
    NewentryPage,
    EntriesPage,
    EntrydetailsPage
  ],
  imports: [
    BrowserModule,
    
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    SigninPage,
    SignupPage,
    MembersPage,
    MemberdetailsPage,
    NewentryPage,
    EntriesPage,
    EntrydetailsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BackendProvider,
    GlobaldataProvider
  ]
})
export class AppModule { }
