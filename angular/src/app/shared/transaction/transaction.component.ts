import { CustomerServiceRepComponent } from './../customer-service-rep/customer-service-rep.component';
import { MailBody } from './../../services/models/mail-body';
import { TransactionService } from './transaction.service';
import { ChartsService } from './../../services/services/charts.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DateSelectionService } from '../calender/calender.service';
import { DatePipe } from '@angular/common';
import { EChartsOption } from 'echarts';
import { Subscription } from 'rxjs';
import { TopCustomerResponse } from 'src/app/services/models';
import { Calender1Service } from '../calender1/calender1.service';
import { EmailService } from 'src/app/services/services';
import { TokenServiceService } from 'src/app/services/token-service/token-service.service';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit, OnDestroy {
  currentPage: number = 1;
  itemsPerPage: number = 6;
  searchTerm: string = '';
  displayCardDetails = false;
  options: EChartsOption = {};
  loading = true;
  filterdate!: string;
  private dateSubscription: Subscription = new Subscription;

  customers: TopCustomerResponse[] = [];

  private yearSubscription: Subscription = new Subscription();
  selectedYear: any;
  recipientEmail!: string;
  customer!: string;
  discount!: string;
  date1!:Date
  date2!:Date
  showEmptyState: boolean = false;

  showOverlay = false;
  selectedDiscount: number | undefined;
  role_name!: string;
  decisionMade : boolean= false;
  v !: void;
  m: number | undefined;

  private discountSubscription!: Subscription;
  decisionMakerInitialized: boolean = false;
  customerServiceRepInitialized: boolean = false;



    showError: boolean = false; // Initialize showError as false



  constructor(private router: Router,private EmailService:EmailService, private ChartsService: ChartsService, private dateSelectionService: DateSelectionService, private datePipe: DatePipe, private Calender1Service: Calender1Service,private TransactionService:TransactionService,private TokenServiceService :TokenServiceService ,private shareddata:SharedService) {}

  ngOnInit(): void {
    this.role_name=this.TokenServiceService.userRole;
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
          this.loadData(dates[0], dates[1]);
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

  showCardDetails(customerName: string) {
    this.displayCardDetails = true;
    this.customer = customerName;
  }


  hideCardDetails() {
    this.displayCardDetails = false;
    const emailRadio = document.getElementById('emailRadio') as HTMLInputElement;
    emailRadio.checked = false;
  }

  navigateToHome(CodeClient: number) {
   this.TransactionService.SetcodeClient(CodeClient);
   this.router.navigate(['transactions']);
  }

  loadData1( startDate?: Date): void {
    console.log("gggggggggggggggg"+startDate)
    if (!startDate) {
      // Handle the case where startDate is not provided (e.g., set a default date)
      startDate = new Date();
      // Replace with your default date logic
      console.log("le start date est"+startDate)
    }
     console.log("kakkaaaaaaaa"+startDate)

    const formattedStartDate = startDate.toISOString();

    console.log('Formatted Start Date:', formattedStartDate );
    this.ChartsService.getCustomersTopcustomersStartDateGet({start_date: formattedStartDate})
    .subscribe(
      (response) => {
        console.log(response);
        this.customers = response.customers.filter(c => c.Client.toLowerCase().includes(this.searchTerm.toLowerCase()));
        if (this.customers.length === 0) {
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
  this.ChartsService.getClientsTopclientsYearGet({year: this.selectedYear})
  .subscribe(
    (response) => {
      console.log(response);
      this.customers = response.customers.filter(c => c.Client.toLowerCase().includes(this.searchTerm.toLowerCase()));
      if (this.customers.length === 0) {
        // Display an alert when data is not available
        alert('Data is not available for the selected date range.');
      }
    },
    (error) => {
      console.error(error);
    }
  );
}

loadData(startDate: Date, endDate: Date) :void {
  const formattedStartDate = startDate.toISOString(); // Or use any other format you need
  const formattedEndDate = endDate.toISOString();

this.ChartsService.getCustsTopcusStartDateEndDateGet({start_date:formattedStartDate,end_date:formattedEndDate})

.subscribe(
  (response) => {
    console.log(response);
    this.customers = response.customers.filter(c => c.Client.toLowerCase().includes(this.searchTerm.toLowerCase()));
    if (this.customers.length === 0) {
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
    this.loadData(dates[0], dates[1]);
  } else if (dates && dates.length === 1) {
    this.loadData1(dates[0]); // Call loadData1 with a single date
  }
  this.TransactionService.Setselectdates(dates)
}




openOverlay() {
  this.showOverlay = true;
}





closeOverlay() {
  this.showOverlay = false;
}





sendEmail(email: string, discount: string) {
  const emailData: MailBody = {
    email: email,
    customer: this.customer,
    discount: discount
  };

  this.EmailService.sendEmailSendEmailPost({body: emailData}).subscribe(
    (response) => {
      console.log('Email sent successfully:', response);

      // Alerting the user that the email was successfully sent
      window.alert('Email sent successfully!');
    },
    (error) => {
      console.error('Error sending email:', error);

      // Optionally, you can also alert the user about the error
      window.alert('Error sending email. Please try again.');
    }
  );
}
handleRadioChange(client: any) {
  // Handle the radio button change event here
  // You can perform any necessary logic here
  // For example, show the error message if the condition is met
  if (this.role_name !== 'Customer Service Representative') {
      this.showError = true;
  } else {
      this.showError = false; // Hide the error message if the condition is not met
  }
}

hideError() {
  // Function to hide the error message
  this.showError = false;
}

getDiscount (){

  this.m=this.TransactionService.getDiscount();
}
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leak
    this.yearSubscription.unsubscribe();
    this.dateSubscription.unsubscribe();
  }



  get role() {
    return this.TokenServiceService.userRole;
  }



}
