import { Component, signal } from '@angular/core';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from "./auth/signup/signup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [LoginComponent, SignupComponent],
})
export class AppComponent {
  isSignUpSuccess = signal<boolean>(false);
  signUpForm(event:boolean){
    this.isSignUpSuccess.set(event)
  }
}
