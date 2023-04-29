import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PortfolioService {

    private PORTFOLIOTABLEUrl = "http://localhost:8000/portfolio/table";
    private ALLPORTFOLIOUrl = "http://localhost:8000/allportfolio";

    constructor(private http: HttpClient) { }


    getUserPortfolioData(): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
        //console.log(this.PORTFOLIOTABLEUrl);
        return this.http.get(this.PORTFOLIOTABLEUrl, { headers });
    }

    getAllPortfolioData(): Observable<any> {
        return this.http.get(this.ALLPORTFOLIOUrl);
    }

}
