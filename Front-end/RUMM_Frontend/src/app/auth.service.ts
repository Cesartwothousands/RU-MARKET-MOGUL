import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private WEBREGUrl = 'http://127.0.0.1:8000/webreg';

    constructor(private http: HttpClient) { }

    register(user: any) {
        return this.http.post(`${this.WEBREGUrl}/register/`, user);
    }

    login(credentials: any) {
        return this.http.post(`${this.WEBREGUrl}/login/`, credentials).pipe(
            tap((response: any) => {
                localStorage.setItem('access_token', response.access);
            })
        );
    }

    logout() {
        localStorage.removeItem('access_token');
        return this.http.post(`${this.WEBREGUrl}/logout/`, {});
    }

    getAccessToken() {
        const printtoken = localStorage.getItem('access_token');
        console.log('Access Token:', printtoken);
        return printtoken;
    }
}
