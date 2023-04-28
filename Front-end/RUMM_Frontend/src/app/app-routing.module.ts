import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { StocksComponent } from './stocks/stocks.component';
import { CryptoComponent } from './crypto/crypto.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './user/register/register.component';
import { LoginComponent } from './user/login/login.component';
import { DiscussionComponent } from './discussion/discussion.component';
import { DetailComponent } from './detail/detail.component';
import { ProtfoliosComponent } from './protfolios/protfolios.component';


const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'stocks', component: StocksComponent },
    { path: 'crypto', component: CryptoComponent },
    { path: 'user', component: UserComponent },
    { path: 'discussion', component: DiscussionComponent },
    { path: 'detail', component: HomeComponent },
    { path: 'detail/:query', component: DetailComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'portfolio', component: ProtfoliosComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
