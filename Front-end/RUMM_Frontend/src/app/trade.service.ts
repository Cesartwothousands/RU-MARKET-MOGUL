import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TradeService {

    constructor(private http: HttpClient) { }

    buyStock(stockSymbol: string, share: number, value: number) {
        const url = 'http://localhost:8000/property/buy/';
        const data = {
            stock_symbol: stockSymbol,
            share: share,
            value: value
        };
        const token = localStorage.getItem('access_token');
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.post(url, data, { headers });
    }

    sellStock(stockSymbol: string, share: number, value: number) {
        const url = 'http://localhost:8000/property/sell/';
        const data = {
            stock_symbol: stockSymbol,
            share: share,
            value: value
        };
        const token = localStorage.getItem('access_token');
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.post(url, data, { headers });
    }

    initializeCash(cash: number) {
        const url = 'http://localhost:8000/property/initialize_cash/';
        const data = { cash: cash };
        const token = localStorage.getItem('access_token');
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.post(url, data, { headers });
    }

    getUserInfo() {
        const url = 'http://localhost:8000/property/user_info/';
        const token = localStorage.getItem('access_token');
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        return this.http.get(url, { headers });
    }
}
