import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    readonly APIUrl = "http://127.0.0.1:8000";
    readonly PhotoUrl = "http://127.0.0.1:8000/media/";
    readonly OVERVIEWUrl = "http://127.0.0.1:8000/overview/";
    private DETAILUrl = "http://127.0.0.1:8000/detail/";

    constructor(private http: HttpClient) { }

    getOverview(): Observable<any[]> {
        return this.http.get<any>(this.OVERVIEWUrl);
    }

    getDetailInfo(query: string): Observable<any[]> {
        return this.http.get<any>(this.DETAILUrl + query);
    }

}
