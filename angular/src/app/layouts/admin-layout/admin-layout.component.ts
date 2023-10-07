import { TodoList } from './../../services/models/todo-list';
import { AddTodoService } from './../../shared/todos/add-todo/add-todo.service';
import { Router } from '@angular/router';
import { TokenServiceService } from './../../services/token-service/token-service.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TodoListService } from 'src/app/shared/todos/todo-list/todo-list.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  private subscription!: Subscription;
  private subscription1!: Subscription;
  role_name!:string;
  bool1!:boolean
  bool!:boolean
constructor(private TokenServiceService:TokenServiceService,private Router:Router,private AddTodoService:AddTodoService ,private TodoList:TodoListService)
{

}

ngOnInit(): void {
  this.role_name = this.TokenServiceService.userRole;
  console.log(this.role);

  this.AddTodoService.test$.subscribe(value => {
      this.bool = value;
      console.log("apres ajout de analyst" + this.bool);
  });
  this.subscription = this.AddTodoService.test$.subscribe(value => {
    this.bool = value;
    console.log("apres ajout de analyst" + this.bool);
});

this.subscription1 = this.TodoList.test$.subscribe(value => {
  this.bool1 = value;
  console.log("apres ajout de analyst" + this.bool1);
});

}
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}

  get userName(): string {
    return this.TokenServiceService.getUsername;
  }

  get role() {
    return this.TokenServiceService.userRole;
  }

  getImageUrl(): string {
    const id=this.TokenServiceService.getUserId
    return `http://localhost:8000/getImage/${id}`;
  }
}
