import { Component } from '@angular/core';
import { ColDef, CellClassParams } from "ag-grid-community";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    columnDefs: ColDef[] = [
        { field: 'symbol', sortable: true, headerName: 'Symbol', flex: 1 },
        { field: 'name', sortable: true, headerName: 'Name', flex: 1 },
        { field: 'livePrice', sortable: true, headerName: 'LivePrice', flex: 1 },
        {
            field: 'change',
            sortable: true,
            headerName: 'Change',
            cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' },
            flex: 1
        },
        {
            field: 'changePercentage',
            sortable: true,
            headerName: 'Change%',
            cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' },
            flex: 1
        },

        { field: 'volume', sortable: true, headerName: 'Volume', flex: 1 },
    ];

    rowData = [
        { symbol: 'AAPL', name: 'Apple Inc.', livePrice: 150, change: 2, changePercentage: 1.3, volume: 100000 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', livePrice: 2500, change: -10, changePercentage: -0.4, volume: 50000 },
        { symbol: 'AMZN', name: 'Amazon.com, Inc.', livePrice: 3300, change: 20, changePercentage: 0.6, volume: 75000 },
    ];

    rowData2 = [
        { symbol: 'MSFT', name: 'Microsoft Corporation', livePrice: 290, change: 5, changePercentage: 1.7, volume: 120000 },
        { symbol: 'TSLA', name: 'Tesla, Inc.', livePrice: 700, change: -15, changePercentage: -2.1, volume: 80000 },
        { symbol: 'NFLX', name: 'Netflix, Inc.', livePrice: 510, change: 8, changePercentage: 1.6, volume: 90000 },
    ];


    currentDataSource = 1;

    onDataSourceChange(dataSource: number) {
        this.currentDataSource = dataSource;
    }
}
