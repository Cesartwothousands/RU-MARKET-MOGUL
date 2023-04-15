import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
    query?: string;
    results: any[] = [];

    constructor(private route: ActivatedRoute, private service: SharedService, private router: Router) { }

    ngOnInit() {
        // Subscribe to route parameters to get the 'query' parameter
        this.route.params.subscribe((params) => {
            // Assign the 'query' parameter value to the 'query' property
            this.query = params['query'];

            // Redirect to the homepage if the query is empty or contains only whitespace
            if (!this.query || this.query.trim() === '') {
                this.router.navigate(['/']);
                return;
            }

            // Call the getDetail() method from the SharedService and subscribe to the returned observable
            this.service.getDetail(this.query).subscribe((data: any[]) => {
                // Assign the received data to the 'results' array
                this.results = data;
            });
        });
    }
}
