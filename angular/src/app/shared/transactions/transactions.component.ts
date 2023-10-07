import { TransactionService } from './../transaction/transaction.service';
import { ArticleResponse } from './../../services/models/article-response';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DateSelectionService } from '../calender3/calender3.service';
import { ChartsService } from './../../services/services/charts.service';
import { TransactionResponse } from 'src/app/services/models';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  currentPage: number = 1;
  itemsPerPage: number = 6;
  searchTerm: string = '';
  allUsers: TransactionResponse[] = [];
  date1!:Date
  date2!:Date
  private dateSubscription: Subscription = new Subscription();
  @Output() modelChange = new EventEmitter<Date[]>();
  constructor(
    private chartsService: ChartsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private dateSelectionService: DateSelectionService,
    private TransactionService:TransactionService
  ) {}

  ngOnInit(): void {
    // Subscribe to selected dates and update your data accordingly


    this.dateSubscription = this.dateSelectionService.selectedDates$.subscribe((dates: Date[] | undefined) => {
      if (dates) {
        if (dates.length === 1) {
          this.date1 = dates[0];

          this.loadTrans(dates[0]);
        } else if (dates.length === 2) {

          this.date1 = dates[0];
          this.date2 = dates[1];
          this.loadTransactions(dates[0], dates[1]);
        }
      }
    });




  }

  loadTransactions(startDate: Date, endDate: Date): void {
    const codeclient = this.TransactionService.GetcodeClient();
    const formattedStartDate = startDate.toISOString(); // Or use any other format you need
    const formattedEndDate = endDate.toISOString();

    // Or use any other format you need

    this.chartsService.getTransctionsTransctionsCodeclientStartDateEndDateGet({
      codeclient,
      start_date: formattedStartDate,
      end_date: formattedEndDate
    }).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.allUsers = response.data;
          this.allUsers = this.allUsers.filter((transaction) =>
          transaction.articles.some(article =>
            article.ArticleName.toLowerCase().includes(this.searchTerm.toLowerCase())
          ))
        } else {
          this.allUsers = []; // or handle empty response as needed
        }
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }

  loadTrans(startDate: Date): void {
    const codeclient = this.TransactionService.GetcodeClient();
    const formattedStartDate = startDate.toISOString(); // Or use any other format you need


    // Or use any other format you need

    this.chartsService.getTransTransCodeclientStartDateGet({
      codeclient,
      start_date: formattedStartDate

    }).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.allUsers = response.data;
          this.allUsers = this.allUsers.filter((transaction) =>
          transaction.articles.some(article =>
            article.ArticleName.toLowerCase().includes(this.searchTerm.toLowerCase())
          ))
        } else {
          this.allUsers = []; // or handle empty response as needed
        }
      },
      (error) => {
        console.error('Error fetching transactions:', error);
      }
    );
  }
















  onDatesChange(event: Event): void {
    // You may need to modify this line to extract the dates properly from your specific event object
    const dates: Date[] = (event as any).dates; // Replace this line with the correct logic to extract the dates
    if (dates && dates.length === 2) {
      this.loadTransactions(dates[0], dates[1]);
    } else if (dates && dates.length === 1) {
      this.loadTrans(dates[0]); // Call loadData1 with a single date
    }
  }











  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.dateSubscription.unsubscribe();
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
    this.loadTransactions(this.date1,this.date2);
  }

}
