import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntrydetailsPage } from './entrydetails';

@NgModule({
  declarations: [
    EntrydetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(EntrydetailsPage),
  ],
})
export class EntrydetailsPageModule {}
