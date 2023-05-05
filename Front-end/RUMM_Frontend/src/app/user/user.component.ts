import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { PortfolioService } from '../portfolio.service';
import { TradeService } from '../trade.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    rowData: any = [];
    totalValue: number = 0;
    totalAssets: number = 0;
    userInfo: any;

    constructor(private authService: AuthService, private router: Router, private portfolioService: PortfolioService, private tradeService: TradeService) { }

    ngOnInit() {
        this.authService.getAccessToken();

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

    onLogout() {
        this.authService.logout().subscribe(() => {
            // Navigate back to the desired page after successful logout
            this.router.navigate(['/']);
        });
    }

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
            this.totalAssets = parseFloat((this.totalValue + this.userInfo.cash).toFixed(3)); // Keep totalAssets with 3 decimal places
        }
        console.log("T", this.totalAssets);
    }


}
