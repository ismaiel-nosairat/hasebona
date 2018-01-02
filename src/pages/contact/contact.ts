import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})

export class ContactPage {

  


  constructor(fb: FormBuilder,public navCtrl: NavController, public navParams: NavParams) {
  
  }
 
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad');
  }
 
  
}
