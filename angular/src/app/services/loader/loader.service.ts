import { Injectable } from '@angular/core';
import { LoaderState } from './loader-state';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();

  constructor() { }

  show(): void {
    console.log("je suis dans show")
    this.loaderSubject.next({show: true});
  }
  hide(): void {
    this.loaderSubject.next({show: false});
  }
}
