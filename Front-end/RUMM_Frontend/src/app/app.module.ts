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

/* Component */
import { AppComponent } from './app.component';
import { DepartmentComponent } from './department/department.component';
import { ShowDepComponent } from './department/show-dep/show-dep.component';
import { AddEditDepComponent } from './department/add-edit-dep/add-edit-dep.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './home/home.component';
import { StocksComponent } from './stocks/stocks.component';
import { CryptoComponent } from './crypto/crypto.component';
import { DiscussionComponent } from './discussion/discussion.component';

/* Service */
import { SharedService } from './shared.service';
import { DetailComponent } from './detail/detail.component';

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
        DiscussionComponent,
        DetailComponent,

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
        MatAutocompleteModule
    ],
    providers: [SharedService],
    bootstrap: [AppComponent]
})
export class AppModule { }
