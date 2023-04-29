import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../portfolio.service';

@Component({
    selector: 'app-share',
    templateUrl: './share.component.html',
    styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
    userPortfolios: any[] = [];

    constructor(private PortfolioService: PortfolioService) { }

    ngOnInit(): void {
        this.PortfolioService.getAllPortfolioData().subscribe((data) => {
            this.userPortfolios = data
                .filter((userPortfolio: string | any[]) => userPortfolio.length > 0)
                .sort((a: string | any[], b: string | any[]) => b.length - a.length);
            console.log(this.userPortfolios);
        });
    }


}
