import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    username = '';
    password = '';
    email = '';

    constructor(private authService: AuthService) { }

    register() {
        const user = {
            username: this.username,
            password: this.password,
            email: this.email
        };

        this.authService.register(user).subscribe(
            (res: any) => {
                localStorage.setItem('token', res.token);
            },
            (err: any) => {
                console.log(err);
            }
        );
        this.authService.register(user).subscribe(
            (data: any) => {
                console.log('Registered:', data);
            },
            (error) => {
                console.error('Registration error:', error);
            }
        );
    }
}
