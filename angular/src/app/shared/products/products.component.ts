import { ChartsService } from './../../services/services/charts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DateSelectionService } from '../calender/calender.service';
import { DatePipe } from '@angular/common';
import { Calender1Service } from '../calender1/calender1.service';
import { TopproductResponse } from 'src/app/services/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  currentPage: number = 1;
  itemsPerPage: number = 6;
  searchTerm: string = '';
  displayCardDetails = false;
  loading = true;
  filterdate!: string;
  date1!:Date;
  date2!:Date;
  private dateSubscription: Subscription = new Subscription;
  products: TopproductResponse[] = [];

  private yearSubscription: Subscription = new Subscription();
  selectedYear: any;

  constructor(private router: Router, private ChartsService: ChartsService, private dateSelectionService: DateSelectionService, private datePipe: DatePipe, private Calender1Service: Calender1Service) {}

  ngOnInit(): void {
    this.yearSubscription = this.Calender1Service.getYear().subscribe((year) => {
      this.selectedYear = year;
      this.loadData2();
    });



    this.dateSubscription = this.Calender1Service.selectedDates$.subscribe((dates: Date[] | undefined) => {
      if (dates) {
        if (dates.length === 1) {
          this.date1 = dates[0];

          this.loadData1(dates[0]);
        } else if (dates.length === 2) {

          this.date1 = dates[0];
          this.date2 = dates[1];
          this.loadData3(dates[0], dates[1]);
        }
      }
    });





  }

  pageChanged(newPage: number) {
    this.currentPage = newPage;
  }

  updateItemsPerPage(value: string): void {
    this.itemsPerPage = parseInt(value, 10);
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.loadData1();
    this.loadData2();
  }




  loadData1(startDate ?:Date): void {
    if (!startDate) {
      // Handle the case where startDate is not provided (e.g., set a default date)
      startDate = new Date();
      // Replace with your default date logic
      console.log("le start date est"+startDate)
    }
    const formattedStartDate = startDate.toISOString();

    this.ChartsService.getProductsTopproductsStartDateGet({ start_date: formattedStartDate })
      .subscribe(
        (response) => {
          console.log(response);
          this.products = response.products.filter((c: TopproductResponse) => c.Article.toLowerCase().includes(this.searchTerm.toLowerCase()));
          if (this.products.length === 0) {
            // Display an alert when data is not available
            alert('Data is not available for the selected date range.');
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  loadData3( startDate: Date, endDate: Date) :void {
    const formattedStartDate = startDate.toISOString(); // Or use any other format you need
    const formattedEndDate = endDate.toISOString();
    this.ChartsService.getPrsTopprsStartDateEndDateGet({ start_date: formattedStartDate ,end_date:formattedEndDate})
      .subscribe(
        (response) => {
          console.log(response);
          this.products = response.products.filter((c: TopproductResponse) => c.Article.toLowerCase().includes(this.searchTerm.toLowerCase()));
          if (this.products.length === 0) {
            // Display an alert when data is not available
            alert('Data is not available for the selected date range.');
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }




  loadData2(): void {
    this.ChartsService.getProduitsTopproduitsYearGet({ year: this.selectedYear })
      .subscribe(
        (response) => {
          console.log(response);
          this.products = response.products.filter((c: TopproductResponse) => c.Article.toLowerCase().includes(this.searchTerm.toLowerCase()));
          if (this.products.length === 0) {
            // Display an alert when data is not available
            alert('Data is not available for the selected date range.');
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }

  onDatesChange(event: Event): void {
    // You may need to modify this line to extract the dates properly from your specific event object
    const dates: Date[] = (event as any).dates; // Replace this line with the correct logic to extract the dates
    if (dates && dates.length === 2) {
      this.loadData3(dates[0], dates[1]);
    } else if (dates && dates.length === 1) {
      this.loadData1(dates[0]); // Call loadData1 with a single date
    }

  }




  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leak
    this.yearSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
  }
}

