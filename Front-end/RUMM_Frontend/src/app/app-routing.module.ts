import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { StocksComponent } from './stocks/stocks.component';
import { CryptoComponent } from './crypto/crypto.component';
import { UserComponent } from './user/user.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { DetailComponent } from './detail/detail.component';


const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'stocks', component: StocksComponent },
    { path: 'crypto', component: CryptoComponent },
    { path: 'user', component: UserComponent },
    { path: 'discussion', component: DiscussionComponent },
    { path: 'detail', component: HomeComponent },
    { path: 'detail/:query', component: DetailComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
