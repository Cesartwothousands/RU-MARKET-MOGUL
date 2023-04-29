
import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import * as d3 from 'd3';


@Component({
    selector: 'app-treemap',
    templateUrl: './treemap.component.html',
    styleUrls: ['./treemap.component.css']
})
export class TreemapComponent implements AfterViewInit {
    private svg: any;
    @ViewChild('tooltip') tooltip!: ElementRef;

    constructor(private elementRef: ElementRef, private AuthService: AuthService) { }

    ngAfterViewInit() {
        this.getPortfolioData();
    }

    getPortfolioData(): void {
        this.AuthService.getPortfolio().subscribe(data => {
            const children = data.map((item: any) => ({
                name: item.symbol || 'Cash',
                value: item.value,
                change: item.change
            }));

            this.createTreeMap(children);
        });
    }

    createTreeMap(children: Array<{ name: string; value: number; change: number }>) {

        const data = {
            name: 'portfolio',
            value: 0,
            change: 0,
            children: children
        };

        const width = 800;
        const height = 500;


        // create a svg container
        this.svg = d3.select(this.elementRef.nativeElement)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // create a layout
        const layout = d3.treemap<{ name: string; value: number; change: number; }>()
            .size([width, height])
            .padding(3)
            .round(true);


        const root = d3.hierarchy(data)
            .sum((d: any) => d.value)
            .sort((a, b) => b.value! - a.value!);

        layout(root as any);


        this.svg.selectAll('rect')
            .data(root.leaves())
            .enter()
            .append('rect')
            .attr('x', (d: any) => d.x0)
            .attr('y', (d: any) => d.y0)
            .attr('width', (d: any) => d.x1 - d.x0)
            .attr('height', (d: any) => d.y1 - d.y0)
            .attr('fill', (d: any) => {
                const change = d.data.change;
                if (d.data.name == 'Cash') {
                    return 'rgba(0, 0, 255, 0.5)';
                }
                else if (change > 0) {
                    return `rgba(0, 128, 0, ${Math.min(0.75, Math.abs(change) * 20)})`;
                } else if (change < 0) {
                    return `rgba(255, 0, 0, ${Math.min(0.75, Math.abs(change) * 20)})`;
                } else {
                    return 'rgba(0, 128, 0, 0.1)';
                }
            });

        // Add labels in the middle of the rectangles and display the change as a percentage
        this.svg.selectAll('text.name')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('class', 'name')
            .attr('x', (d: any) => d.x0 + (d.x1 - d.x0) / 2)
            .attr('y', (d: any) => d.y0 + (d.y1 - d.y0) / 2 - 10)
            .text((d: any) => d.data.name)
            .attr('font-size', '18px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black');

        this.svg.selectAll('text.change')
            .data(root.leaves())
            .enter()
            .append('text')
            .attr('class', 'change')
            .attr('x', (d: any) => d.x0 + (d.x1 - d.x0) / 2)
            .attr('y', (d: any) => d.y0 + (d.y1 - d.y0) / 2 + 10)
            .text((d: any) => (d.data.change * 100).toFixed(2) + '%')
            .attr('font-size', '12px')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black');


        const renderer = this.elementRef.nativeElement.ownerDocument.defaultView!.Renderer2;


        this.svg.selectAll('rect')
            .on('mouseover', (event: any, d: any) => {
                d3.select(this.tooltip.nativeElement)
                    .style('opacity', 1)
                    .style('left', (d.x0 + (d.x1 - d.x0) / 2) + 'px')
                    .style('top', (d.y1 + 10) + 'px')
                    .html(`Symbol: ${d.data.name}<br>Value: ${d.data.value}<br>Realtime Change: ${d.data.change}`);
            })
            .on('mouseout', () => {
                d3.select(this.tooltip.nativeElement)
                    .style('opacity', 0);
            });


    }
}