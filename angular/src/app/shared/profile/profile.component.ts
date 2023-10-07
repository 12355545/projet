import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordChangeRequest, Profil } from 'src/app/services/models';
import { AuthenticationService, UserService } from 'src/app/services/services';
import { TokenServiceService } from 'src/app/services/token-service/token-service.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Profil = {
    email: '',
    full_name: '',
    role_name: ''
  }; // Property to hold user's details


  public fileImage!: File;
  uploadedImage!: File;
  imagePath: any;
  apiURLImage:string ='http://localhost:8000';
  editing = false;
  id!:number;
  password1!: string;
  password!: string;
  password2!: string;
constructor(private tokenService:TokenServiceService,private userService:UserService,private  authService: AuthenticationService,private http: HttpClient,private Router:Router){

}
  ngOnInit(): void {
   this.getAll();
  }

  upload(): void {
    this.id = this.tokenService.getUserId;

    if (this.id) {
      if (this.password === this.password2) { // Check if new password matches repeat password
        const changepassword: PasswordChangeRequest = { new_password: this.password, old_password: this.password1 };

        this.authService.changePasswordChangePasswordIdPost({ 'id': this.id, body: changepassword })
          .subscribe(
            response => {
              alert(response.message);  // Using the returned message from the backend
            },
            error => {
              alert('Failed to change password: ' + JSON.stringify(error));
            }
          );
      } else {
        alert('New password and repeat password do not match.');
      }
    } else {
      alert('Please provide a valid token and password.');
    }
  }
  


  getAll(): void {
    this.id = this.tokenService.getUserId;
    this.userService.readUsersUsersIdGet({ 'id': this.id })
      .subscribe({
        next: (data: Profil) => {
          this.user = data; // Assign the data to the user property
        }
      });
  }

  uploadImageFS(file: File, filename: string, id : number): Observable<any>{
    const imageFormData = new FormData();
    imageFormData.append('images', file, filename);
    const url = `${this.apiURLImage}/uploadFS/${id}`;
    return this.http.post(url, imageFormData);
  }


  processForm() {
    const userId = this.tokenService.getUserId;
      this.uploadImageFS(this.uploadedImage, this.uploadedImage.name, userId).subscribe(() => {
      })

  }



  onImageUpload(event: any) {
    this.uploadedImage = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(this.uploadedImage);
    reader.onload = (_event) => { this.imagePath = reader.result; }
    }


    getImageUrl(): string {
      const id=this.tokenService.getUserId
      return `http://localhost:8000/getImage/${id}`;
    }

}
