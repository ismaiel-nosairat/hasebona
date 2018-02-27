import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import {WelcomePage} from '../pages/welcome/welcome';

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = TabsPage;
  rootPage:any = WelcomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private translate:TranslateService) {
    platform.ready().then(() => {
//      platform.setDir('rtl', true);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();


      this.translate.onDefaultLangChange.subscribe((event: LangChangeEvent) =>
      {
        console.log('lan changed');
      if(event.lang == 'ar')
        {
          platform.setDir('rtl', true);
          platform.setDir('ltr', false);
        }
        else
        {
          platform.setDir('ltr', true);
          platform.setDir('rtl', false);
        }
      });
      platform.setDir('rtl', true);
      platform.setDir('ltr', false);
      this.translate.setDefaultLang('ar');
    });
  }
}
