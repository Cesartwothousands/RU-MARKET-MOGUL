import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from '../../trade.service';
import { NgForm } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-sell',
    templateUrl: './sell.component.html',
    styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
    @Input() stockSymbol: string = '';
    @Input() cash: number = 0;
    @Input() price: any = 0;
    @Input() availableShares: number = 0;
    share: number = 0.1;
    value: number = 0;
    showModal: boolean = false;

    constructor(private tradeService: TradeService) { }

    ngOnInit(): void {
        this.updateValue();
        console.log(this.stockSymbol.toUpperCase(), this.cash, this.price);
    }

    openSellModal() {
        this.showModal = true;
    }

    closeSellModal() {
        this.showModal = false;
    }

    onSell(sellForm: NgForm) {
        if (sellForm.valid) {
            this.tradeService
                .sellStock(this.stockSymbol.toUpperCase(), this.share, this.value)
                .pipe(
                    catchError((error) => {
                        alert('Sale failed: ' + error.message);
                        return of(null);
                    })
                )
                .subscribe((response) => {
                    if (response) {
                        // Update cash in parent component after a successful sale.
                        this.cash += this.value;
                        alert('Sale successful');
                        this.closeSellModal();

                        // Reload the page after a successful sale.
                        location.reload();
                    }
                });
        }
    }

    updateValue() {
        if (this.share != null) {
            this.share = Number(this.share?.toFixed(1));
        } else {
            this.share = 0.1;
        }
        this.value = this.share * this.price;
    }
}
