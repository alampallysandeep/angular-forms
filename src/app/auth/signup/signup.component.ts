import { JsonPipe } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { equalValues } from '../../form-element-validator';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports: [FormsModule,ReactiveFormsModule,JsonPipe],
})
export class SignupComponent {
  isSignupSuccess = output<boolean>();
  sources = [
    { id: 'google', label: 'Google', value: 'google' },
    { id: 'friend', label: 'Referred by friend', value: 'friend' },
    { id: 'other', label: 'Other', value: 'other' }
  ]; 
  signUpReactiveForm = new FormGroup({
    email: new FormControl('',
      {
        validators: [Validators.email, Validators.required]
      }
    ),
    passwords: new FormGroup({
      password: new FormControl('',
        {
          validators: [Validators.minLength(6), Validators.required]
        }
      ),
      confirmpassword: new FormControl('',
        {
          validators: [Validators.minLength(6), Validators.required]
        }
      ),
    }, { validators: [equalValues('password','confirmpassword')] }),
    names: new FormGroup({
      firstName: new FormControl('',
        {
          validators: [Validators.required]
        }
      ),
      lastName: new FormControl('',
        {
          validators: [Validators.required]
        }
      ),
    }),
    address: new FormGroup({
      street: new FormControl('',
        {
          validators: [Validators.required]
        }
      ),
      number: new FormControl('',
        {
          validators: [Validators.required]
        }
      ),
      postalCode: new FormControl('',
        {
          validators: [Validators.required]
        }
      ),
      city: new FormControl('',
        {
          validators: [Validators.required]
        }
      ),
    }),
    role: new FormControl('',
      {
        validators:[Validators.required]
      }
    ),
    source: new FormArray(
      this.sources.map(()=> new FormControl(false))
    ),
    agree: new FormControl(false,
      {
        validators:[Validators.required]
      }
    )
  })
  signUpSubmit(){
    if(this.signUpReactiveForm.invalid){
      return
    }
    console.log(this.signUpReactiveForm.value)
    this.isSignupSuccess.emit(true)
  }
  get emailIsInvalid(){
    return this.signUpReactiveForm.controls.email.invalid && this.signUpReactiveForm.controls.email.touched && this.signUpReactiveForm.controls.email.dirty
  }

  get passwordIsInvalid(){
    return this.signUpReactiveForm.controls.passwords.controls.password.invalid && this.signUpReactiveForm.controls.passwords.controls.password.touched && this.signUpReactiveForm.controls.passwords.controls.password.dirty
  }

  get confirmpasswordIsInvalid(){
    return this.signUpReactiveForm.controls.passwords.controls.password.invalid && this.signUpReactiveForm.controls.passwords.controls.password.touched && this.signUpReactiveForm.controls.passwords.controls.password.dirty
  }

  get roleIsInvalid(){
    return this.signUpReactiveForm.controls.role.invalid && this.signUpReactiveForm.controls.role.touched && this.signUpReactiveForm.controls.role.dirty
  }

  resetForm(){
    this.signUpReactiveForm.reset();
  }
}
