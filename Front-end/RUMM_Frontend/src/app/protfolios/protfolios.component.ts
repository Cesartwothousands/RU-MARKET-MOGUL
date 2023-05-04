import { Component, OnInit } from '@angular/core';
import { ColDef, CellClassParams } from 'ag-grid-community';
import { PortfolioService } from '../portfolio.service';
import { TradeService } from '../trade.service';


@Component({
    selector: 'app-protfolios',
    templateUrl: './protfolios.component.html',
    styleUrls: ['./protfolios.component.css']
})
export class ProtfoliosComponent implements OnInit {

    rowData: any = [];
    totalValue: number = 0;
    totalAssets: number = 0;
    userInfo: any;

    constructor(private portfolioService: PortfolioService, private tradeService: TradeService) { }

    ngOnInit(): void {
        this.portfolioService.getUserPortfolioData().subscribe(
            (data) => {
                this.rowData = data;
                //console.log(this.rowData);
                //console.log(this.rowData[0].value)
                //console.log(typeof (this.rowData[0].value))
                this.getTotalValue();
                //console.log(this.totalValue);
            }
        );

        this.getUserDetailsWithStockInfo();


    }

    columnDefs: ColDef[] = [
        {
            field: 'symbol', headerName: 'Symbol', sortable: true, flex: 1, cellRenderer: (params: any) => {
                const link = document.createElement('a');
                link.setAttribute('href', `detail/${params.value}`);
                link.innerText = params.value;
                return link;
            }
        },
        //{ field: 'price', headerName: 'Price', sortable: true, flex: 2 },
        //{ field: 'shortname', headerName: 'Name', sortable: true, flex: 2 },
        //{ field: 'longname', headerName: 'Long Name', sortable: true, flex: 3 },

        { field: 'share', headerName: 'Share', sortable: true, flex: 1 },
        { field: 'value', headerName: 'Value', sortable: true, flex: 1 },
        { field: 'change', headerName: 'Change', sortable: true, flex: 1, cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' } },
        { field: 'price_change', headerName: '% Change', sortable: true, flex: 1, cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' } },
        { field: 'sector', headerName: 'Sector', sortable: true, flex: 2 },
    ];

    getTotalValue(): void {
        this.totalValue = this.rowData.reduce((total: number, item: any) => {
            const value = parseFloat(item.value);
            return isNaN(value) ? total : total + value;
        }, 0);

        // Ensure totalValue is a valid number
        this.totalValue = isNaN(this.totalValue) ? 0 : this.totalValue;
        this.calculateTotalAssets(); // Add this line
    }

    getUserDetailsWithStockInfo() {
        return this.tradeService.getUserInfo().subscribe((userInfo: any) => {
            this.userInfo = userInfo || {};

            // Ensure userInfo.cash is a valid number
            const cash = parseFloat(this.userInfo.cash);
            this.userInfo.cash = isNaN(cash) ? 0 : cash;

            // Calculate totalAssets
            this.calculateTotalAssets(); // Add this line
        });
    }

    calculateTotalAssets() {
        if (this.totalValue && this.userInfo && this.userInfo.cash !== undefined) {
            this.totalAssets = this.totalValue + this.userInfo.cash;
        }
        console.log("T", this.totalAssets);
    }

}
