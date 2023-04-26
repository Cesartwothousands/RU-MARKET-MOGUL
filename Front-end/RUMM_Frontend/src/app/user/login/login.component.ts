import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username = '';
    password = '';


    constructor(private authService: AuthService) { }

    login(username: string, password: string) {
        this.authService.login({ username, password }).subscribe(
            (data: any) => {
                console.log('Logged in:', data);
            },
            (error) => {
                console.error('Login error:', error);
            }
        );
    }
}
