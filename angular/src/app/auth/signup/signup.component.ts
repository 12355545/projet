import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/services/models';
import { AuthenticationService } from 'src/app/services/services';
import { TokenServiceService } from 'src/app/services/token-service/token-service.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  user: User = {
    email: '',
    full_name: '',
    hashed_password: '',
    role: ''
  };

  passwordStrength: number = 0;
  errorMsgs: string[] = [];
  calculatePasswordStrength(event: Event) {
    const password = (event.target as HTMLInputElement).value;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length >= 6;

    if (isLengthValid && hasUppercase && hasNumber) {
      this.passwordStrength = 100; // Toutes les contraintes respectées (vert)
    } else if (!hasUppercase && !hasNumber && !isLengthValid) {
      this.passwordStrength = 0; // Aucune contrainte respectée (rouge)
    } else {
      this.passwordStrength = 50; // Une contrainte respectée (bleu)
    }
  }
  getProgressBarColorClass() {
    if (this.passwordStrength === 100) {
      return 'bg-green-500'; // Couleur verte
    } else if (this.passwordStrength >= 50) {
      return 'bg-blue-500'; // Couleur bleue
    } else {
      return 'bg-red-500'; // Couleur rouge par défaut
    }
  }




  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenServiceService
  ) {}

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsgs = [];
    this.authService.registerRegisterPost({
      body: this.user
    }).subscribe({
      next: (res) => {
        
        this.router.navigate(['login'])
      },
      error: (err) => {
        this.errorMsgs = err.error.validationErrors;
      }
    });
  }








}
