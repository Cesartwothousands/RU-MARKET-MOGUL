import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-price-chart',
    templateUrl: './price-chart.component.html',
    styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnInit {
    private data = [
        { Date: '2022-01-01', Price: 179.50, Open: 180.00, High: 182.00, Low: 178.00, Close: 181.00, Volume: 500000, Sma: 177.00, Upper: 185.00, Lower: 169.00 },

        { Date: '2022-03-15', Price: 172.25, Open: 172.50, High: 174.00, Low: 171.00, Close: 173.00, Volume: 700000, Sma: 170.00, Upper: 176.00, Lower: 164.00 },

        { Date: '2022-06-30', Price: 184.75, Open: 185.00, High: 187.00, Low: 183.00, Close: 186.00, Volume: 800000, Sma: 182.00, Upper: 191.00, Lower: 173.00 },

        { Date: '2022-09-22', Price: 164.50, Open: 165.00, High: 167.00, Low: 163.00, Close: 166.00, Volume: 600000, Sma: 162.00, Upper: 169.00, Lower: 155.00 },

        { Date: '2023-01-01', Price: 192.25, Open: 192.00, High: 195.00, Low: 190.00, Close: 194.00, Volume: 900000, Sma: 190.00, Upper: 198.00, Lower: 182.00 },

        { Date: '2023-04-19', Price: 184.25, Open: 184.00, High: 187.00, Low: 182.00, Close: 186.00, Volume: 800000, Sma: 182.00, Upper: 190.00, Lower: 174.00 },

        { Date: '2023-07-31', Price: 173.50, Open: 173.00, High: 175.00, Low: 170.00, Close: 174.00, Volume: 500000, Sma: 170.00, Upper: 178.00, Lower: 162.00 },

        { Date: '2023-10-10', Price: 189.50, Open: 190.00, High: 192.00, Low: 187.00, Close: 191.00, Volume: 600000, Sma: 186.00, Upper: 195.00, Lower: 177.00 },

        { Date: '2024-02-14', Price: 176.50, Open: 177.00, High: 179.00, Low: 174.00, Close: 178.00, Volume: 400000, Sma: 172.00, Upper: 182.00, Lower: 162.00 },
    ];

    private svg: any;
    private margin = 50;
    private width = 750 - this.margin * 2;
    private height = 400 - this.margin * 2;
    private parseDate = d3.utcParse('%Y-%m-%d');

    private createSvg(): void {
        this.svg = d3
            .select('figure#price-chart')
            .append('svg')
            .attr('width', this.width + this.margin * 2)
            .attr('height', this.height + this.margin * 2)
            .append('g')
            .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
    }

    private drawLines(data: any[]): void {
        const x = d3
            .scaleUtc()
            .domain(
                d3.extent(data, (d) => this.parseDate(d.Date) ?? new Date()) as [Date, Date])
            .range([0, this.width]);

        const minY = Math.min(...data.map(d => d.Lower));
        const maxY = Math.max(...data.map(d => d.Upper));

        const y = d3
            .scaleLinear()
            .domain([minY, maxY])
            .range([this.height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        const line = d3
            .line<{ Date: string; value: number }>()
            .x((d) => x(this.parseDate(d.Date) ?? new Date()))
            .y((d) => y(d.value));

        const colors = ['blue', 'green', 'red', 'orange'];

        const lineData = [
            data.map((d) => ({ Date: d.Date, value: d.Price })),
            data.map((d) => ({ Date: d.Date, value: d.Sma })),
            data.map((d) => ({ Date: d.Date, value: d.Upper })),
            data.map((d) => ({ Date: d.Date, value: d.Lower })),
        ];

        lineData.forEach((series, i) => {
            this.svg
                .append('path')
                .datum(series)
                .attr('fill', 'none')
                .attr('stroke', colors[i])
                .attr('stroke-width', 1.5)
                .attr('d', line);
        });

        this.svg
            .append('g')
            .attr('transform', `translate(0,${this.height})`)
            .call(xAxis);

        this.svg.append('g').call(yAxis);
    }


    ngOnInit(): void {
        this.createSvg();
        this.drawLines(this.data);
    }
}