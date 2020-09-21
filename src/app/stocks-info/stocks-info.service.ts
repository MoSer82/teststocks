import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

const apiUrl = 'https://finnhub.io/api/v1/';
const socket = new WebSocket('wss://ws.finnhub.io?token=btcaqcf48v6rudsh60kg');

export interface Trade {
  p: number;
  s: string;
  t: number;
  v: number;
}

export interface Stock {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
  currency: string;
  company?: Company;
}

export interface Company {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
  rtPrice?: any[];
}

@Injectable({
  providedIn: 'root'
})

export class StocksInfoService {

  public realTimeTradesSubject = new Subject<Trade[]>();

  constructor(
    private http: HttpClient
  ) {
    socket.addEventListener('open', (ev => {
      console.log('Websocket is open');
    }))
    socket.addEventListener('message', (ev) => {
      console.log(ev.data);
      if (ev.type == 'trade') {
        this.realTimeTradesSubject.next(ev.data);
      }
    })    
  }

  get realTimeTrades(): Observable<Trade[]> {
    return this.realTimeTradesSubject.asObservable();
  }

  getStockList(): Observable<Stock[]>  {
    return this.http.get<Stock[]>(apiUrl + 'stock/symbol', { params: { exchange: 'US' }});
  }

  getCompanyProfile(symbol: string): Observable<Company> {
    return this.http.get<Company>(apiUrl + 'stock/profile2', { params: { symbol: symbol }});
  }

  getStockPrice(params: any) {
    return this.http.get(apiUrl + 'stock/candle', { params: params });
  }

  subscribeWS(symbol: string) {
    socket.send(JSON.stringify({'type':'subscribe', 'symbol': symbol}));
  }

  unsubscribe(symbol: string) {
    socket.send(JSON.stringify({'type':'unsubscribe', 'symbol': symbol}));
  }

  closeSocket() {
    socket.close();
  }

  completeRTSubject() {
    this.realTimeTradesSubject.complete();
  }

}