import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'RUMM_Frontend';

    constructor(private router: Router) { }

    onSearch(query: string) {
        this.router.navigate(['/detail', query]);
    }
}
