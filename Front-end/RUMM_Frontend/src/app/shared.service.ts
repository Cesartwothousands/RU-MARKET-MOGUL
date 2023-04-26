import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    private OVERVIEWUrl = "http://127.0.0.1:8000/overview/";
    private DETAILUrl = "http://127.0.0.1:8000/detail/";
    private DETAILGRAPHUrl = "http://127.0.0.1:8000/detailgraph/";
    private STOCKPREDICTIONUrl = "http://127.0.0.1:8000/predictions/";

    constructor(private http: HttpClient) { }

    getOverview(): Observable<any[]> {
        return this.http.get<any>(this.OVERVIEWUrl);
    }

    getDetailInfo(query: string): Observable<any[]> {
        return this.http.get<any>(this.DETAILUrl + query);
    }

    getDetailGraph(query: string): Observable<any[]> {
        return this.http.get<any>(this.DETAILGRAPHUrl + query);
    }

    getStockPrediction(query: string): Observable<any[]> {
        return this.http.get<any>(this.STOCKPREDICTIONUrl + query);
    }
}
