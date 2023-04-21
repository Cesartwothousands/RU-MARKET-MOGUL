import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-candlestick-chart',
    templateUrl: './candlestick-chart.component.html',
    styleUrls: ['./candlestick-chart.component.css']
})
export class CandlestickChartComponent implements OnInit, OnChanges {

    @Input() data: any[] = [];

    ngOnInit(): void {
        this.updateChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.updateChart();
        }
    }

    private svg: any;
    private margin = 40;
    private width = 750 - this.margin * 2;
    private height = 400 - this.margin * 2;

    private createSvg(): void {
        d3.select('figure#candlestick-chart').select('svg').remove();

        this.svg = d3
            .select('figure#candlestick-chart')
            .append('svg')
            .attr('width', this.width + this.margin * 2)
            .attr('height', this.height + this.margin * 2)
            .append('g')
            .attr('transform', `translate(${this.margin},${this.margin})`);
    }

    private drawCandlesticks(data: any[]): void {
        if (data !== undefined && data.length > 0) {
            const dateKey = data[0].hasOwnProperty('Date') ? 'Date' : 'Datetime';
            //console.log('Date key:', dateKey);

            const x = d3
                .scaleBand()
                .domain(
                    data.map((d) => d[dateKey])
                )
                .range([0, this.width])
                .padding(0.2);

            const minY = Math.min(...data.map(d => d.Low));
            const maxY = Math.max(...data.map(d => d.High));

            const y = d3
                .scaleLinear()
                .domain([minY - (maxY - minY) * 0.3, maxY + (maxY - minY) * 0.1])
                .range([this.height, 0]);

            const len = this.data.length;
            const L = data[0].hasOwnProperty('Date') ? Math.round(len / 10) : Math.round(len / 6);
            const xTicks = this.getXTicks(data, L);
            const xAxis = d3.axisBottom(x).tickValues(xTicks.map(d => d[dateKey]));

            const yAxis = d3.axisLeft(y);

            const candlestick_x = (d: any) => x(d[dateKey]) ?? 0;
            const candlestick_y = (d: any) => y(Math.max(d.Open, d.Close));
            const candlestick_height = (d: any) => Math.abs(y(d.Open) - y(d.Close));
            var candlestick_color = (d: any) => (d.Open > d.Close ? 'red' : 'green');

            this.svg
                .selectAll('.candlestick')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'candlestick')
                .attr('x', candlestick_x)
                .attr('y', candlestick_y)
                .attr('height', candlestick_height)
                .attr('width', x.bandwidth())
                .attr('fill', candlestick_color);

            // Define helper functions
            const wick_x = (d: any) => (x(d[dateKey]) ?? 0) + x.bandwidth() / 2;
            const wick_y1 = (d: any) => y(d.High);
            const wick_y2 = (d: any) => y(d.Low);
            const wick_color = (d: any) => (d.Open > d.Close ? 'red' : 'green');

            // Create wicks
            this.svg
                .selectAll('.wick')
                .data(data)
                .enter()
                .append('line')
                .attr('class', 'wick')
                .attr('x1', wick_x)
                .attr('x2', wick_x)
                .attr('y1', wick_y1)
                .attr('y2', wick_y2)
                .attr('stroke', wick_color)
                .attr('stroke-width', 1);

            // Add volume bars
            const maxVolume = d3.max(data, (d) => d.Volume) ?? 0;
            const yVolume = d3.scaleLinear().domain([0, maxVolume]).range([this.height * 0.2, this.height * 0.05]);

            // Define volume bar attributes as functions
            const volume_x = (d: any) => x(d[dateKey]) ?? 0;
            const volume_y = (d: any) => this.height - yVolume(d.Volume);
            const volume_height = (d: any) => yVolume(d.Volume);
            const volume_fill = (d: any) => (d.Open > d.Close ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 128, 0, 0.5)');

            this.svg
                .selectAll('.volume')
                .data(data)
                .enter()
                .append('rect')
                .attr('class', 'volume')
                .attr('x', volume_x)
                .attr('y', volume_y)
                .attr('height', volume_height)
                .attr('width', x.bandwidth())
                .attr('fill', volume_fill);

            this.svg
                .append('g')
                .attr('transform', `translate(0,${this.height})`)
                .call(xAxis);

            this.svg.append('g').call(yAxis);
        }
    }

    private getXTicks(data: any[], n: number): any[] {
        return data.filter((_, i) => i % n === 0);
    }

    updateChart() {
        this.createSvg();
        this.drawCandlesticks(this.data);
    }
}