import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import * as d3 from 'd3';

@Component({
    selector: 'app-price-chart',
    templateUrl: './price-chart.component.html',
    styleUrls: ['./price-chart.component.css']
})
export class PriceChartComponent implements OnInit, OnChanges {

    @Input() data: any[] = [];

    ngOnInit(): void {
        this.updateChart();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['data']) {
            this.updateChart();
            console.log('Data:', this.data);
        }
    }

    private svg: any;
    private margin = 40;
    private width = 750 - this.margin * 2;
    private height = 400 - this.margin * 2;
    private parseDate = d3.utcParse('%Y-%m-%d');
    private parseDatetime = d3.utcParse('%Y-%m-%d %H:%M');

    private createSvg(): void {
        d3.select('figure#price-chart').select('svg').remove();

        this.svg = d3
            .select('figure#price-chart')
            .append('svg')
            .attr('width', this.width + this.margin * 2)
            .attr('height', this.height + this.margin * 2)
            .append('g')
            .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
    }

    private drawLines(data: any[]): void {
        // Check if the data has the 'Datetime' field
        const hasDatetimeField = data.some((d) => d.hasOwnProperty('Datetime'));

        // Choose the appropriate parsing function
        const parseFunction = hasDatetimeField ? this.parseDatetime : this.parseDate;

        const x = d3
            .scaleUtc()
            .domain(
                d3.extent(data, (d) => {
                    const dateString = hasDatetimeField ? d.Datetime : d.Date;
                    return parseFunction(dateString) ?? new Date();
                }) as [Date, Date]
            )
            .range([0, this.width]);

        const minY = Math.min(...data.map(d => Math.min(d.Lower, d.Close)));
        const maxY = Math.max(...data.map(d => Math.max(d.Upper, d.Close)));

        const y = d3
            .scaleLinear()
            .domain([minY - (maxY - minY) * 0.1, maxY + (maxY - minY) * 0.1])
            .range([this.height, 0]);

        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        const line = d3
            .line<{ Date?: string; Datetime?: string; value: number }>()
            .x((d) => {
                const dateString = d.Datetime ? d.Datetime : d.Date ? d.Date : '';
                return x(parseFunction(dateString) ?? new Date());
            })
            .y((d) => y(d.value));

        const colors = ['black', 'blue', 'red', 'green'];

        const lineData = [
            data.map((d) => ({ Date: d.Date ?? d.Datetime, value: d.Close })),
            data.map((d) => ({ Date: d.Date ?? d.Datetime, value: d.Sma })),
            data.map((d) => ({ Date: d.Date ?? d.Datetime, value: d.Upper })),
            data.map((d) => ({ Date: d.Date ?? d.Datetime, value: d.Lower })),
        ];

        lineData.forEach((series, i) => {
            const path = this.svg
                .append('path')
                .datum(series)
                .attr('fill', 'none')
                .attr('stroke', colors[i])
                .attr('stroke-width', 1.5)
                .attr('d', line);

            if (i >= 1) {
                path.attr('stroke-dasharray', '1');
            }
        });

        this.svg
            .append('g')
            .attr('transform', `translate(0,${this.height})`)
            .call(xAxis);

        this.svg.append('g').call(yAxis);
    }

    private drawLegend(): void {
        const legendData = [
            { color: 'black', label: 'Price' },
            { color: 'blue', label: 'SMA' },
            { color: 'red', label: 'Upper' },
            { color: 'green', label: 'Lower' },
        ];

        const legendGroup = this.svg.append('g').attr('transform', `translate(${this.width - 40}, 0)`);

        legendData.forEach((entry, i) => {
            const legend = legendGroup.append('g').attr('transform', `translate(0, ${i * 15})`);

            legend
                .append('rect')
                .attr('width', 10)
                .attr('height', 10)
                .style('fill', entry.color);

            legend
                .append('text')
                .attr('x', 12.5)
                .attr('y', 10)
                .text(entry.label)
                .attr('font-size', '10px')
                .attr('text-anchor', 'start')
                .attr('alignment-baseline', 'top');
        });
    }

    updateChart() {
        this.createSvg();
        this.drawLines(this.data);
        this.drawLegend();
    }
}