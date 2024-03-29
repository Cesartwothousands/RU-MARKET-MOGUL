import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

/* Forms */
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { NgxEchartsModule } from 'ngx-echarts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


/* Component */
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { StocksComponent } from './stocks/stocks.component';
import { CryptoComponent } from './crypto/crypto.component';
import { DiscussionComponent } from './discussion/discussion.component';

/* Service */
import { SharedService } from './shared.service';
import { DetailComponent } from './detail/detail.component';
import { PriceChartComponent } from './detail/price-chart/price-chart.component';
import { CandlestickChartComponent } from './detail/candlestick-chart/candlestick-chart.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { CashComponent } from './detail/cash/cash.component';
import { BuyComponent } from './detail/buy/buy.component';
import { SellComponent } from './detail/sell/sell.component';
import { InitCashComponent } from './user/init-cash/init-cash.component';
import { ProtfoliosComponent } from './protfolios/protfolios.component';
import { TreemapComponent } from './treemap/treemap.component';
import { ShareComponent } from './share/share.component';

@NgModule({
    declarations: [
        AppComponent,
        UserComponent,
        HomeComponent,
        StocksComponent,
        CryptoComponent,
        DiscussionComponent,
        DetailComponent,
        PriceChartComponent,
        CandlestickChartComponent,
        RegisterComponent,
        LoginComponent,
        CashComponent,
        BuyComponent,
        SellComponent,
        InitCashComponent,
        ProtfoliosComponent,
        TreemapComponent,
        ShareComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        AgGridModule,
        MatIconModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
        MatExpansionModule,
        NoopAnimationsModule,
        BrowserAnimationsModule,
    ],
    providers: [SharedService],
    bootstrap: [AppComponent]
})
export class AppModule { }
