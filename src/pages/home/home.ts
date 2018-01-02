import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { BackendProvider } from '../../providers/backend/backend';
import { AlertController, LoadingController, Loading } from 'ionic-angular';
import { GlobaldataProvider } from '../../providers/globaldata/globaldata';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('barCanvas') barCanvas;
    @ViewChild('creditorsCanvas') creditorsCanvas;
    @ViewChild('debtorsCanvas') debtorsCanvas;
    @ViewChild('lineCanvas') lineCanvas;

    barChart: any;
    creditorsChart: any;
    debtorsChart: any;
    lineChart: any;
    loading: Loading;
        report: any;
        creditors: any[] = [];
        debtors: any[] = [];
        creditorsBalance: any[] = [];
        debtorsBalance: any[] = [];




        constructor(
            public navCtrl: NavController,
            private backend: BackendProvider,
            private gdata:GlobaldataProvider,
            private loadingCtrl: LoadingController,
            private alertCtrl: AlertController) {


            this.report = gdata.report;
            console.log(this.report);
            this.creditors = gdata.creditors;
            this.debtors = gdata.debtors;
            this.creditorsBalance = gdata.creditorsBalance;
            this.debtorsBalance = gdata.debtorsBalance;
        }

        ionViewWillEnter(){
            
            console.log('to refresh');
            this.creditorsChart.labels=(this.gdata.creditors);
            this.creditorsChart.data.datasets.forEach((dataset) => {
                    dataset.data=this.gdata.creditorsBalance;
                });

            
        this.creditorsChart.update();
    }
    ionViewDidLoad() {
        console.log('ionViewDidLoad');    
        
        this.creditorsChart = new Chart(this.creditorsCanvas.nativeElement, {
            //Math.floor(Math.random() * (255 - 50 + 1)) + 50
            type: 'doughnut',
            data: {
                labels: this.creditors,
                datasets: [{
                    label: 'Oqlaa',
                    data: this.creditorsBalance,
                    backgroundColor:'rgba(255, 99, 132, 0.8)',
                    hoverBackgroundColor:'#FF6384'
                    
                }]
            },
            
            options: {
                legend: {
                    display: true,
                    position:'left'
                }}            
            

        });

        this.debtorsChart = new Chart(this.debtorsCanvas.nativeElement, {
            //Math.floor(Math.random() * (255 - 50 + 1)) + 50
            type: 'doughnut',
            data: {
                labels: this.debtors,
                datasets: [{
                    label: 'Oqlaa',
                    data: this.debtorsBalance,
                    backgroundColor:'rgba(54, 162, 235, 0.6',
                    hoverBackgroundColor:'#36A2EB'
                }]
            },
            options: {
                legend: {
                    display: true,
                    position:'left'
                }}            
        });

        
        this.lineChart = new Chart(this.lineCanvas.nativeElement, {

            type: 'line',
            data: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(75,192,192,0.4)",
                        borderColor: "rgba(75,192,192,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(75,192,192,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(75,192,192,1)",
                        pointHoverBorderColor: "rgba(220,220,220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: [65, 59, 80, 81, 56, 55, 40],
                        spanGaps: false,
                    }
                ]
            }

        });

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


    

}