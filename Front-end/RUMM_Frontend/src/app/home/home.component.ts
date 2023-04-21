import { Component, OnInit } from '@angular/core';
import { ColDef, CellClassParams } from "ag-grid-community";
import { SharedService } from 'src/app/shared.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    rowData: any = [];
    rowData2: any = [];
    tmp: any = [];

    constructor(private service: SharedService) { }

    ngOnInit(): void {
        this.service.getOverview().subscribe((data) => {
            this.rowData = data;
            this.tmp = JSON.parse(this.rowData);
            this.rowData = this.tmp.slice(0, 50);
            this.rowData2 = this.tmp.slice(50, 75);
        });
    }

    columnDefs: ColDef[] = [
        {
            field: 'symbol', sortable: true, headerName: 'Symbol', flex: 2,
            cellRenderer: (params: any) => {
                const link = document.createElement('a');
                link.setAttribute('href', `detail/${params.value}`);
                link.innerText = params.value;
                return link;
            }
        },
        { field: 'name', sortable: true, headerName: 'Name', flex: 3 },
        { field: 'lastprice', sortable: true, headerName: 'Last Price', flex: 2 },
        {
            field: 'change1',
            sortable: true,
            headerName: 'Change',
            cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' },
            flex: 2
        },
        {
            field: 'change2',
            sortable: true,
            headerName: '% Change',
            cellStyle: (params: CellClassParams) => params.value < 0 ? { color: 'red' } : { color: 'green' },
            flex: 2
        },

        { field: 'volume', sortable: true, headerName: 'Volume', flex: 2 },
        { field: 'marketcap', sortable: true, headerName: 'Market Cap', flex: 2 },
        { field: 'sector', sortable: true, headerName: 'Sector', flex: 3 },
    ];

    currentDataSource = 1;

    onDataSourceChange(dataSource: number) {
        this.currentDataSource = dataSource;
    }
}
