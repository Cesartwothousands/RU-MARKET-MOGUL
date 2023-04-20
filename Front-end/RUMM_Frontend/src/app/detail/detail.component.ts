import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';

interface DetailInfo {
    symbol: string;
    shortname: string;
    longname: string;
    sector: string;
    current_price: number;
    previous_close: number;
    open: number;
    day_low: number;
    day_high: number;
    year_low: number;
    year_high: number;
    volume: number;
    marketCap: number;
    averageVolume: number;
    targetHighPrice: number;
    targetLowPrice: number;
    targetMedianPrice: number;
    recommendationMean: number;
    recommendationKey: string;
    website: string;
    twitter: string;
    price_change: number;
    price_change_percent: number;
    start_date: string;
}

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    query?: string;
    results: any[] = [];

    constructor(private route: ActivatedRoute, private service: SharedService, private router: Router) { }

    ngOnInit() {
        // Subscribe to route parameters to get the 'query' parameter
        this.route.params.subscribe((params) => {
            // Assign the 'query' parameter value to the 'query' property
            this.query = params['query'];

            // Redirect to the homepage if the query is empty or contains only whitespace
            if (!this.query || this.query.trim() === '') {
                this.router.navigate(['/']);
                return;
            }

            // Call the getDetail() method from the SharedService and subscribe to the returned observable
            this.service.getDetailInfo(this.query).subscribe((data: any) => {
                //console.log('Received data:', typeof data);
                this.results = JSON.parse(data);
                //console.log('Parsed data:', this.results);
            });

        });
    }
}
