import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/services/services';
import { TokenServiceService } from 'src/app/services/token-service/token-service.service';
import { NgToastService } from 'ng-angular-popup';
import { PasswordResetRequest } from 'src/app/services/models';

import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent {
  emailForm: FormGroup;
  private subscription!: Subscription;

  constructor(private authService: AuthenticationService, private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  requestNewPassword() {
    if (this.emailForm.valid) {
      const emailValue: PasswordResetRequest = this.emailForm.value;

      this.subscription = this.authService.resetRequestRequestPost({ body: emailValue }).subscribe(
        () => {
          alert('Email has been sent with instructions to reset your password.');
        },
        error => {
          alert('Failed to send email: ' + error);
        }
      );
    } else {
      alert('Please provide a valid email.');
    }
  }


  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
