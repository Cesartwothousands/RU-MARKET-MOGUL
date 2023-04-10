import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DepartmentComponent } from './department/department.component';
import { HomeComponent } from './home/home.component';
import { StocksComponent } from './stocks/stocks.component';
import { CryptoComponent } from './crypto/crypto.component';
import { UserComponent } from './user/user.component';
import { DiscussionComponent } from './discussion/discussion.component';


const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'stocks', component: StocksComponent },
    { path: 'crypto', component: CryptoComponent },
    { path: 'user', component: UserComponent },
    { path: 'discussion', component: DiscussionComponent },
    { path: 'department', component: DepartmentComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
