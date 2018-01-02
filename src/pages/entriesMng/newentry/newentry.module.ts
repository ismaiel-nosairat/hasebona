import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewentryPage } from './newentry';

@NgModule({
  declarations: [
    NewentryPage,
  ],
  imports: [
    IonicPageModule.forChild(NewentryPage),
  ],
})
export class NewentryPageModule {}
