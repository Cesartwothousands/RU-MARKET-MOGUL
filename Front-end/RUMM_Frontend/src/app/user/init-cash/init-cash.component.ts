import { Component } from '@angular/core';
import { TradeService } from '../../trade.service';

@Component({
    selector: 'app-init-cash',
    templateUrl: './init-cash.component.html',
    styleUrls: ['./init-cash.component.css']
})
export class InitCashComponent {
    cash: number = 0;

    constructor(private tradeService: TradeService) { }

    initializeCash() {
        this.tradeService.initializeCash(this.cash).subscribe(response => {
            console.log(response);
        });
    }
}
