import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';
import * as d3 from 'd3';
import { DataService } from '../data.service'; // Import the service

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {

  public dataSource: DataSource = {
    datasets: [
        {
            data: [],
            backgroundColor: [
                '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
                '#4bc0c0', '#9966ff', '#ff9f40'
            ]
        }
    ],
    labels: []
  };

  private data: any[] = [];
  private svg: any;
  private margin = 0;
  private width = 250;
  private height = 250;
  private radius = Math.min(this.width, this.height) / 2 - 10;
  private colors!: d3.ScaleOrdinal<string, string>;

  constructor(
    private dataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.createSvg();
      this.createColors();

      this.dataService.budgetData$.subscribe((budgetData) => {
        this.updateCharts(budgetData);
      });

      this.dataService.fetchBudgetData();
    }
  }

  private updateCharts(budgetData: any[]) {

    for (let i = 0; i < budgetData.length; i++) {
      this.dataSource.datasets[0].data[i] = budgetData[i].budget;
      this.dataSource.labels[i] = budgetData[i].title;

      this.data.push({
        "Framework": budgetData[i].title,
        "Stars": budgetData[i].budget
      });
    }

    this.drawChart();
    this.createChart();
  }

  private chartInstance: any;

  createChart() {
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables);

      const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          if (this.chartInstance) {
            this.chartInstance.destroy();
          }
          this.chartInstance = new Chart(ctx, {
            type: 'pie',
            data: this.dataSource
          });
        }
      }
    }
  }

  private createSvg(): void {
    this.svg = d3.select("figure#pie")
      .append("svg")
      .attr("width", this.width + this.margin * 2)
      .attr("height", this.height + this.margin * 2)
      .append("g")
      .attr("transform", "translate(" + (this.width / 2 + this.margin) + "," + (this.height / 2 + this.margin) + ")");
  }

  private createColors(): void {
    this.colors = d3.scaleOrdinal<string, string>()
      .domain(this.dataSource.datasets[0].data.map(String))
      .range([
        '#ffcd56', '#ff6384', '#36a2eb', '#fd6b19',
        '#4bc0c0', '#9966ff', '#ff9f40'
      ]);
  }

  private drawChart(): void {
    const pie = d3.pie<any>().value((d: any) => Number(d.Stars));

    this.svg.selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('path')
      .attr('d', d3.arc()
        .innerRadius(this.radius * 0.5)
        .outerRadius(this.radius))
      .attr('fill', (d: any, i: any) => this.colors(i))
      .attr("stroke", "#121926")
      .style("stroke-width", "1px");

    const labelLocation = d3.arc()
      .innerRadius(this.radius * 0.6)
      .outerRadius(this.radius);

    this.svg.selectAll('pieces')
      .data(pie(this.data))
      .enter()
      .append('text')
      .text((d: any) => d.data.Framework)
      .attr("transform", (d: any) => "translate(" + labelLocation.centroid(d) + ")")
      .style("text-anchor", "middle")
      .style("font-size", 10);
  }
}


// allow data to be read
interface Dataset {
  data: number[];
  backgroundColor: string[];
}

interface DataSource {
  datasets: Dataset[];
  labels: string[];
}
