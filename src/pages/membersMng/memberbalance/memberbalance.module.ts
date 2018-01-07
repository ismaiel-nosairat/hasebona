import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MemberbalancePage } from './memberbalance';

@NgModule({
  declarations: [
    MemberbalancePage,
  ],
  imports: [
    IonicPageModule.forChild(MemberbalancePage),
  ],
})
export class MemberbalancePageModule {}
