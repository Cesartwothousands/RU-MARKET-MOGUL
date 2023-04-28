import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from '../../trade.service';
import { NgForm } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-buy',
    templateUrl: './buy.component.html',
    styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {
    @Input() stockSymbol: string = '';
    @Input() cash: number = 0;
    @Input() price: any = 0;
    share: number = 0.1;
    value: number = 0;
    showModal: boolean = false;


    constructor(private tradeService: TradeService) { }

    ngOnInit(): void {
        this.updateValue();
        console.log(this.stockSymbol.toUpperCase(), this.cash, this.price);
    }

    openBuyModal() {
        this.showModal = true;
    }

    closeBuyModal() {
        this.showModal = false;
    }

    onBuy(buyForm: NgForm) {
        if (buyForm.valid) {
            this.tradeService
                .buyStock(this.stockSymbol.toUpperCase(), this.share, this.value)
                .pipe(
                    catchError((error) => {
                        alert('Purchase failed: ' + error.message);
                        return of(null);
                    })
                )
                .subscribe((response) => {
                    if (response) {
                        // Update cash in parent component after a successful purchase.
                        this.cash -= this.value;
                        alert('Purchase successful');
                        this.closeBuyModal();

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
