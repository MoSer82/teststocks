import { Component, OnInit, OnDestroy } from '@angular/core';
import { Stock, Company, StocksInfoService } from './stocks-info.service';

@Component({
  selector: 'app-test-stocks-info',
  templateUrl: './stocks-info.component.html',
  styleUrls: ['./stocks-info.component.scss'],
  providers: [ StocksInfoService ]
})
export class StocksInfoComponent implements OnInit, OnDestroy {

  public list: Stock[] = [];
  public companyInfo: Company;
  public currentStock: any = {};
  public startDate = new Date();
  public endDate = new Date();
  public params = {
    from: 0,
    to: 0,
    resolution: '',
    symbol: ''
  };
  public resData = ['1', '5', '15', '30', '60', 'D', 'W', 'M'];
  public currentResolution;

  constructor(
    public service: StocksInfoService
  ) {  }

  ngOnInit() {
    this.startDate.setDate((new Date()).getDate() - 7);
    this.currentResolution = this.resData[4];
    this.service.getStockList().subscribe((res) => {
      this.list = res;
    });

    this.service.realTimeTrades.subscribe((data) => {
      if (data && data.length) {
        data.forEach(item => {
          let findCompany = this.list.find(com => com.symbol == item.s);
          if (findCompany) {
            findCompany.company.rtPrice.push({
              date: new Date(item.t),
              price: item.p
            })
          }
        })
      }
    })
  }

  loadCandlesData() {
    if (!this.params.symbol || !this.startDate || !this.endDate || !this.currentResolution) {
      return;
    }
    this.params.from = Math.round(this.startDate.getTime() / 1000);
    this.params.to = Math.round(this.endDate.getTime() / 1000);
    this.params.resolution = this.currentResolution;
    this.service.getStockPrice(this.params).subscribe((data: any) => {
      this.currentStock.stockPrice = [];
      if (data.t && data.t.length) {
        for (let k = 0; k < data.t.length; k++) {
          this.currentStock.stockPrice.push({
            date: new Date(data.t[k] * 1000),
            l: data.l[k],
            h: data.h[k],
            o: data.o[k],
            c: data.c[k]
          })
        }
      }
    })
  }

  selectRow(e) {
      let findCompany = this.list.find(item => item.symbol == e.key);
      if (findCompany) {
        if (!findCompany.company) {
          this.service.getCompanyProfile(e.key).subscribe((res) => {
            if (res && Object.keys(res).length) {
              this.currentStock.name = res.name;
              this.currentStock.symbol = res.ticker;
              this.currentStock.currency = res.currency;              
              findCompany.company = res;
            }
          })
        } else {
          this.currentStock.name = findCompany.company.name;
          this.currentStock.symbol = findCompany.company.ticker;
          this.currentStock.currency = findCompany.company.currency;
        }
        this.params.symbol = e.key;
        this.loadCandlesData();
        this.service.subscribeWS(e.key);
      }
  }

  customizeTooltip(arg) {
    return {
        text: "Open: " + arg.openValue.toFixed(2) + "<br/>" +
              "Close: " + arg.closeValue.toFixed(2) + "<br/>" +
              "High: " + arg.highValue.toFixed(2) + "<br/>" +
              "Low: " + arg.lowValue.toFixed(2) + "<br/>"
    };
  }

  ngOnDestroy() {
    this.service.closeSocket();
    this.service.completeRTSubject();
  }

}
