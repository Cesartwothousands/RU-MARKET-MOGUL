import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
import { TradeService } from '../trade.service'; // Import AuthService
import { map } from 'rxjs/operators';


@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    query: string = '';
    results: any[] = [];
    results_graph: any[][] = [[], [], [], [], []];
    selectedInterval = '1d';
    graph_data: any[] = [];
    stock_prediction: any = {};
    userInfo: any = {};
    stockCurrentPrice: number = 0;
    userDetailsWithStockInfo: any;
    userDetailsAvailable = false;

    constructor(private route: ActivatedRoute, private service: SharedService, private router: Router, private tradeService: TradeService) { }


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
                this.stockCurrentPrice = this.results[0].current_price;
                this.getUserDetailsWithStockInfo(this.stockCurrentPrice);
                //console.log('Parsed data:', this.results);
            });

            this.service.getDetailGraph(this.query).subscribe((data: any) => {
                //console.log('Received data:', data);
                this.results_graph = data;
                this.graph_data = this.results_graph[0];
                //console.log('Parsed data1:', this.graph_data);

                if (this.results_graph[0].length === 0) {
                    this.selectedInterval = '2m';
                    this.onIntervalChange();
                }
            });

        });

        // Call this method when you need the user details with stock information
        //this.getUserDetailsWithStockInfo();
    }

    getQuery() {
        this.route.params.subscribe((params) => {
            // Assign the 'query' parameter value to the 'query' property
            this.query = params['query'];

            // Redirect to the homepage if the query is undefined, empty or contains only whitespace
            if (!this.query || this.query.trim() === '') {
                this.router.navigate(['/']);
                return;
            }
        });
    }

    fetchStockPrediction() {
        if (!this.query) {
            return;
        }
        this.service.getStockPrediction(this.query).subscribe((data_pre: any) => {
            this.stock_prediction = data_pre;
            console.log('Parsed data2:', this.stock_prediction);
        });
    }


    onStartPrediction() {
        this.getQuery();
        this.fetchStockPrediction();
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

    getUserDetailsWithStockInfo(currentPrice: number) {
        return this.tradeService.getUserInfo().subscribe((userInfo: any) => {
            this.userInfo = userInfo || {};

            const stockInfo = userInfo?.stocks?.find(
                (stock: any) => stock.stock_symbol.toUpperCase() === this.query?.toUpperCase()
            );
            this.userInfo.stockShares = stockInfo ? stockInfo.share : 0;

            this.stockCurrentPrice = currentPrice;

            const userDetailsWithStockInfo = {
                username: this.userInfo.name || '',
                stock_symbol: this.query || null,
                cash: this.userInfo.cash || 0,
                stock_price: this.stockCurrentPrice,
                share: this.userInfo.stockShares || 0,
            };
            //console.log(userDetailsWithStockInfo);
            this.userDetailsWithStockInfo = userDetailsWithStockInfo;
            this.userDetailsAvailable = true;
        });
    }


}

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