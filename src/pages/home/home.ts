import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { BackendProvider } from '../../providers/backend/backend';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { GlobaldataProvider } from '../../providers/globaldata/globaldata';
import { ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('barCanvas') barCanvas;
    @ViewChild('creditorsCanvas') creditorsCanvas;
    @ViewChild('debtorsCanvas') debtorsCanvas;

    barChart: any;
    creditorsChart: any;
    debtorsChart: any;
    
    loading: Loading;
    report: any;
    creditors: any[];
    debtors: any[] = [];
    creditorsBalance: any[] = [];
    debtorsBalance: any[] = [];
    firstVisit: boolean;
    isThereData: boolean = false;


    constructor(
        public navCtrl: NavController,
        private backend: BackendProvider,
        private gdata: GlobaldataProvider,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private alertCtrl: AlertController,
        private translate:TranslateService
    ) {

        console.log(this.translate.getDefaultLang());
        this.report = gdata.report;
        console.log(this.report);
        this.creditors = gdata.creditors;
        this.debtors = gdata.debtors;
        this.creditorsBalance = gdata.creditorsBalance;
        this.debtorsBalance = gdata.debtorsBalance;
        this.firstVisit = true;

        if (gdata.creditors.length > 0)
            this.isThereData = true;
    }


    ionViewWillEnter() {

        console.log("will Enter" + this.firstVisit);
        if (!this.firstVisit) {
            this.refreshHomePage();

        }
        this.firstVisit = false;

    }
    ionViewDidLoad() {

        console.log('ionViewDidLoad');
        if (this.isThereData) {
            let colorArrRGB = this.backend.generateColorsRGBA(this.creditorsBalance.length, 3);
            let colorArrHEX = this.backend.generateColorsHEX(this.creditorsBalance.length, 3);
            this.creditorsChart = new Chart(this.creditorsCanvas.nativeElement, {
                //Math.floor(Math.random() * (255 - 50 + 1)) + 50
                type: 'doughnut',
                data: {
                    labels: this.creditors,
                    datasets: [{
                        label: 'Oqlaa',
                        data: this.creditorsBalance,
                        backgroundColor: colorArrRGB,
                        hoverBackgroundColor: colorArrHEX

                    }]
                },

                options: {
                    legend: {
                        display: true,
                        position: 'left'
                    }
                }


            });

            let colorArrRGB1 = this.backend.generateColorsRGBA(this.debtorsBalance.length, 0);
            let colorArrHEX1 = this.backend.generateColorsHEX(this.debtorsBalance.length, 0);
            this.debtorsChart = new Chart(this.debtorsCanvas.nativeElement, {
                //Math.floor(Math.random() * (255 - 50 + 1)) + 50
                type: 'doughnut',
                data: {
                    labels: this.debtors,
                    datasets: [{
                        label: 'Oqlaa',
                        data: this.debtorsBalance,
                        backgroundColor: colorArrRGB1,
                        hoverBackgroundColor: colorArrHEX1
                    }]
                },
                options: {
                    legend: {
                        display: true,
                        position: 'left'
                    }
                }
            });


           
        }
    }






    showLoading() {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }








    showError(text) {
        console.log("To stop and show errro");
        this.loading.dismiss();
        console.log("To display alert");
        let msg;
        if (text.status === 404) {
            msg = "Not Found";
        }
        else
            msg = text;
        let alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: msg,
            buttons: ['OK']
        });
        alert.present();
    }

    doRefresh(refresher) {
        console.log('Begin async operation', refresher);

        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }


    refreshHomePage() {
        //    let toast = this.presentToast();
        //    toast.present();
        this.backend.loadReportOnlyWithPromise().then(
            res => {
                if (this.gdata.creditors.length > 0) {
                    this.isThereData = true;
                    console.log('to refresh');

                    let colorArrRGB = this.backend.generateColorsRGBA(this.gdata.creditors.length, 3);
                    let colorArrHEX = this.backend.generateColorsHEX(this.gdata.creditors.length, 3);

                    let colorArrRGB1 = this.backend.generateColorsRGBA( this.gdata.debtorsBalance.length, 0);
                    let colorArrHEX1 = this.backend.generateColorsHEX( this.gdata.debtorsBalance.length, 0);


                    this.creditorsChart.data.labels = this.gdata.creditors;
                    this.creditorsChart.data.datasets.forEach((dataset) => {
                        dataset.data = this.gdata.creditorsBalance;
                        dataset.backgroundColor= colorArrRGB,
                        dataset.hoverBackgroundColor= colorArrHEX;
                        console.log(dataset.data);
                    });
                    this.debtorsChart.data.labels = (this.gdata.debtors);
                    console.log(this.debtorsChart.labels);
                    this.debtorsChart.data.datasets.forEach((dataset) => {
                        dataset.data = this.gdata.debtorsBalance;
                        dataset.backgroundColor= colorArrRGB1,
                        dataset.hoverBackgroundColor= colorArrHEX1;
                        console.log(dataset.data);
                    });
                    this.creditorsChart.update();
                    this.debtorsChart.update();
                    this.isThereData = true;
                }
                else {
                    this.isThereData = false;
                }

                //          toast.dismiss();
            },
            err => {
                this.displayErrorToast(err);
            }
        ).catch(err => {
            this.displayErrorToast(err);
        })
    }



    refreshHomePage2() {
        //    let toast = this.presentToast();
        //    toast.present();
        this.backend.loadReportOnlyWithPromise().then(
            res => {
                console.log('to refresh');

                this.creditorsChart.labels = this.gdata.creditors;
                console.log(this.creditorsChart.labels);
                this.creditorsChart.data.datasets.forEach((dataset) => {
                    dataset.data = this.gdata.creditorsBalance;
                    console.log(dataset.data);
                });
                this.debtorsChart.labels = (this.gdata.debtors);
                console.log(this.debtorsChart.labels);
                this.debtorsChart.data.datasets.forEach((dataset) => {
                    dataset.data = this.gdata.debtorsBalance;
                    console.log(dataset.data);
                });
                this.creditorsChart.update();
                this.debtorsChart.update();
                //          toast.dismiss();
            },
            err => {
                this.displayErrorToast(err);
            }
        ).catch(err => {
            this.displayErrorToast(err);
        })
    }


    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'User was added successfully',
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        return toast;
        //toast.present();

    }


    displayErrorToast(err) {
        console.log(err);
        let toast = this.toastCtrl.create({
            message: 'Update data failed',
            duration: 3000,
            position: 'middle'
        });

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });
        toast.present();

    }


}