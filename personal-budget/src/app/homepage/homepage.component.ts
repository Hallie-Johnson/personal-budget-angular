import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { isPlatformBrowser } from '@angular/common';

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
                '#ffcd56', // Eat out
                '#ff6384', // Rent
                '#36a2eb', // Grocery
                '#fd6b19', // Entertainment
                '#4bc0c0', // Utilities
                '#9966ff', // Transport
                '#ff9f40'  // Savings
            ]
        }
    ],
    labels: []
  };

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {  }

  ngAfterViewInit(): void {
    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (var i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
          this.dataSource.labels[i] = res.myBudget[i].title;
        }
        this.createChart();
      });
  }

  createChart() {
    // Debugged since professor's code was not working for me
    if (isPlatformBrowser(this.platformId)) {
      Chart.register(...registerables); // Register all components
      const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const myPieChart = new Chart(ctx, {
            type: 'pie',
            data: this.dataSource
          });
        }
      }
    }
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
