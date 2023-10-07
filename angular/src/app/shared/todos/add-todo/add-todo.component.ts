import { TokenServiceService } from './../../../services/token-service/token-service.service';
import { TodoDbIn } from 'src/app/services/models';
import { UserService } from 'src/app/services/services';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddTodoService } from './add-todo.service';

import { DatePipe } from '@angular/common';





@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {
  todos!:TodoDbIn[];
  todo: TodoDbIn = {
    description: '',
    time: '',
    title: ''
  };
  role_name!: string;
  
  minDate: string;


  constructor(public dialogRef: MatDialogRef<AddTodoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TodoDbIn,
    private UserService:UserService ,private TokenServiceService :TokenServiceService,private AddTodoService:AddTodoService ,private datePipe: DatePipe) {
      const today = new Date();
    today.setDate(today.getDate() + 1); // Add one day to today's date
    this.minDate = today.toISOString().split('T')[0];
     }

  ngOnInit() {
    this.role_name=this.TokenServiceService.userRole;

    if (this.data !== null){
      this.todo = this.data;
    }
    if(this.TokenServiceService.userRole == 'SUPER_ADMIN') {
      this.AddTodoService.ResetTest();
    }
  }

  onSubmit(){

  this.onCreateTodo();

  }
  isDateValid(selectedDate: string): boolean {
    const today = new Date();
    const selected = new Date(selectedDate);
    return selected > today;
  }

  onCreateTodo():void {

    this.UserService.createTodoTodoPost({ body: this.todo })
    .subscribe(  data => {
      this.onClose(this.todo);
    });

   if(this.TokenServiceService.userRole=='Decision maker'){
    this.AddTodoService.SetTest(true);

   }

};


  onClose(value:any){
    this.dialogRef.close(value);
  }

}
