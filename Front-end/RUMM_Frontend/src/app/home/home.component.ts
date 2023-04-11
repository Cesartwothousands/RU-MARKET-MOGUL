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
        { field: 'lastprice', sortable: true, headerName: 'Last Price', flex: 1 },
        {
            field: 'change1',
            sortable: true,
            headerName: 'Change',
            cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' },
            flex: 1
        },
        {
            field: 'change2',
            sortable: true,
            headerName: '% Change',
            cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' },
            flex: 1
        },

        { field: 'volume', sortable: true, headerName: 'Volume', flex: 1 },
        { field: 'marketcap', sortable: true, headerName: 'Market Cap', flex: 1 },
        { field: 'sector', sortable: true, headerName: 'Industry', flex: 1 },
    ];

    rowData = [{ "symbol": "ATVI", "name": "Activision Blizzard, Inc.", "sector": "Electronic Gaming & Multimedia", "lastprice": 85.48, "change1": 0.26, "change2": 0.31, "volume": 4948951, "marketcap": 67039744000 }, { "symbol": "ADBE", "name": "Adobe Inc.", "sector": "Software\u2014Infrastructure", "lastprice": 376.25, "change1": -4.35, "change2": -1.14, "volume": 1689674, "marketcap": 172585877504 }, { "symbol": "ADP", "name": "Automatic Data Processing, Inc.", "sector": "Staffing & Employment Services", "lastprice": 214.22, "change1": -1.89, "change2": -0.87, "volume": 1076542, "marketcap": 88762482688 },];

    rowData2 = [
        { "symbol": "AMD", "name": "Advanced Micro Devices, Inc.", "sector": "Semiconductors", "lastprice": 84.21, "change1": -0.75, "change2": -0.88, "volume": 30194592, "marketcap": 100997998336 }, { "symbol": "ALGN", "name": "Align Technology, Inc.", "sector": "Medical Devices", "lastprice": 633.5, "change1": -0.5, "change2": -0.08, "volume": 1027940, "marketcap": 51174447104 },
    ];


    currentDataSource = 1;

    onDataSourceChange(dataSource: number) {
        this.currentDataSource = dataSource;
    }
}
