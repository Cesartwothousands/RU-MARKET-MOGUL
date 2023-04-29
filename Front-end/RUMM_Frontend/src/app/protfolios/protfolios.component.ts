import { Component, OnInit } from '@angular/core';
import { ColDef, CellClassParams } from 'ag-grid-community';
import { PortfolioService } from '../portfolio.service';


@Component({
    selector: 'app-protfolios',
    templateUrl: './protfolios.component.html',
    styleUrls: ['./protfolios.component.css']
})
export class ProtfoliosComponent implements OnInit {

    rowData: any = [];

    constructor(private portfolioService: PortfolioService) { }

    ngOnInit(): void {
        this.portfolioService.getUserPortfolioData().subscribe(
            (data) => {
                this.rowData = data;
                console.log(this.rowData);
            }
        );
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

}
