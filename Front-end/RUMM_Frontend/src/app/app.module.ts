import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DepartmentComponent } from './department/department.component';
import { ShowDepComponent } from './department/show-dep/show-dep.component';
import { AddEditDepComponent } from './department/add-edit-dep/add-edit-dep.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';

import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { StocksComponent } from './stocks/stocks.component';
import { CryptoComponent } from './crypto/crypto.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { SharedService } from './shared.service';

@NgModule({
    declarations: [
        AppComponent,
        DepartmentComponent,
        ShowDepComponent,
        AddEditDepComponent,
        UserComponent,
        HomeComponent,
        StocksComponent,
        CryptoComponent,
        DiscussionComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        AgGridModule
    ],
    providers: [SharedService],
    bootstrap: [AppComponent]
})
export class AppModule { }
