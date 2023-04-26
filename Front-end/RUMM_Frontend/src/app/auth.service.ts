import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
        return this.http.post(`${this.WEBREGUrl}/login/`, credentials);
    }

    logout() {
        //      return this.http.post('http://127.0.0.1:8000/logout/', {});
    }
}
