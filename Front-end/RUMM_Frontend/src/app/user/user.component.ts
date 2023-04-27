import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
    }

    onLogout() {
        this.authService.logout().subscribe(() => {
            // Navigate back to the desired page after successful logout
            this.router.navigate(['/']);
        });
    }

}
