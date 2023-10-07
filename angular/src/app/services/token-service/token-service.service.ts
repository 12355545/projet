import { Injectable } from '@angular/core';

import {JwtHelperService} from "@auth0/angular-jwt";
import { LoginResponse } from '../models';
@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {


  saveResponse(response: LoginResponse): void {
    console.log(response.access_token as string)
    localStorage.setItem('token', response.access_token as string);
    localStorage.setItem('id', response.id as any as string);
    localStorage.setItem('nom', response.full_name as any as string);


  }


  get getToken(): string {
    return localStorage.getItem('token') as string;
  }

  get getUserId(): number {
    return localStorage.getItem('id') as any as number;
  }

  get getUsername(): string {
    return localStorage.getItem('nom') as any as string;
  }

  get userRole(): string {
    const token = this.getToken;
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);

   // console.log("le role est "+decodedToken.role[0].name)

      return decodedToken.sub ;
    }
    return '--';
  }

  cleanup(): void {
    const selectedDiscount = localStorage.getItem('selectedDiscount'); // Get the selected discount value
    localStorage.clear(); // Clear the entire localStorage
    if (selectedDiscount !== null) {
      localStorage.setItem('selectedDiscount', selectedDiscount as any as string);
     // Set the selected discount back in localStorage
    }
  }


  get isTokenValid(): boolean {
    const token = this.getToken;
    if (token) {
      const jwtHelper = new JwtHelperService();
      const isTokenExpired = jwtHelper.isTokenExpired(token);
      if (isTokenExpired) {
        localStorage.clear();
        return false;
      }
      return true;
    }
    return false;
  }

}
