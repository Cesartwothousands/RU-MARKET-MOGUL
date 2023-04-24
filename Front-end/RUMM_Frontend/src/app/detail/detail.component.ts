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
    results_graph: any[][] = [[], [], [], [], []];
    selectedInterval = '1d';
    graph_data: any[] = [];

    constructor(private route: ActivatedRoute, private service: SharedService, private router: Router) { }

    ngOnInit() {
        this.onIntervalChange();

        // Subscribe to route parameters to get the 'query' parameter
        this.route.params.subscribe((params) => {
            // Assign the 'query' parameter value to the 'query' property
            this.query = params['query'];

            // Redirect to the homepage if the query is empty or contains only whitespace
            if (!this.query || this.query.trim() === '') {
                this.router.navigate(['/']);
                return;
            }

            this.service.getDetailInfo(this.query).subscribe((data: any) => {
                //console.log('Received data:', typeof data);
                this.results = JSON.parse(data);
                //console.log('Parsed data:', this.results);
            });

            this.service.getDetailGraph(this.query).subscribe((data: any) => {
                //console.log('Received data:', data);
                this.results_graph = data;
                this.graph_data = this.results_graph[0];
                //console.log('Parsed data:', this.graph_data);

                if (this.results_graph[0].length === 0) {
                    this.selectedInterval = '2m';
                    this.onIntervalChange();
                }
            });

        });


    }

    onIntervalChange() {

        const index = this.getIntervalIndex(this.selectedInterval);
        this.graph_data = this.results_graph[index];
    }

    getIntervalIndex(interval: string): number {
        switch (interval) {
            case '1d':
                return 0;
            case '2m':
                return 1;
            case '6m':
                return 2;
            case '1y':
                return 3;
            case '5y':
                return 4;
            default:
                return 0;
        }
    }

}
