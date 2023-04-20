import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-candlestick-chart',
    templateUrl: './candlestick-chart.component.html',
    styleUrls: ['./candlestick-chart.component.css']
})
export class CandlestickChartComponent implements OnInit {
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
        // Add more data points here
    ];

    private svg: any;
    private margin = 50;
    private width = 750 - this.margin * 2;
    private height = 400 - this.margin * 2;
    private parseDate = d3.utcParse('%Y-%m-%d');

    private createSvg(): void {
        this.svg = d3
            .select('figure#candlestick-chart')
            .append('svg')
            .attr('width', this.width + this.margin * 2)
            .attr('height', this.height + this.margin * 2)
            .append('g')
            .attr('transform', `translate(${this.margin},${this.margin})`);
    }

    private drawCandlesticks(data: any[]): void {
        data.forEach((d: any) => {
            d.Date = this.parseDate(d.Date);
        });

        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.Date))
            .range([0, this.width])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([
                d3.min(data, (d) => d.Low) ?? 0,
                d3.max(data, (d) => d.High) ?? 0,
            ])
            .range([this.height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        this.svg
            .selectAll('.candlestick')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'candlestick')
            .attr('x', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => x(d.Date))
            .attr('y', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => y(Math.max(d.Open, d.Close)))
            .attr('height', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => Math.abs(y(d.Open) - y(d.Close)))
            .attr('width', x.bandwidth())
            .attr('fill', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => (d.Open > d.Close ? 'red' : 'green'));


        // Add volume bars
        const maxVolume = d3.max(data, (d) => d.Volume) ?? 0;
        const yVolume = d3.scaleLinear().domain([0, maxVolume]).range([this.height * 0.25, 0]);

        this.svg
            .selectAll('.volume')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'volume')
            .attr('x', (d: any) => x(d.Date))
            .attr('y', (d: any) => this.height - yVolume(d.Volume))
            .attr('height', (d: any) => yVolume(d.Volume))
            .attr('width', x.bandwidth())
            .attr('fill', (d: any) => (d.Open > d.Close ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)'));

        this.svg
            .selectAll('.wick')
            .data(data)
            .enter()
            .append('line')
            .attr('class', 'wick')
            .attr('x1', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => x(d.Date)! + x.bandwidth() / 2)
            .attr('x2', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => x(d.Date)! + x.bandwidth() / 2)
            .attr('y1', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => y(d.High))
            .attr('y2', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => y(d.Low))
            .attr('stroke', (d: { Date: string; Open: number; High: number; Low: number; Close: number }) => (d.Open > d.Close ? 'red' : 'green'))
            .attr('stroke-width', 1);

        this.svg
            .append('g')
            .attr('transform', `translate(0,${this.height})`)
            .call(xAxis);

        this.svg.append('g').call(yAxis);
    }

    ngOnInit(): void {
        this.createSvg();
        this.drawCandlesticks(this.data);
    }
}