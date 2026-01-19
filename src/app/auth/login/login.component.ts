import { JsonPipe, NgClass } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { emailIsUnique, mustContainQuestionMark } from '../../form-element-validator';

// function mustContainQuestionMark(control:AbstractControl){
//   if(control.value.includes('?')){
//     return null;
//   }

//   return {doesNotContainQuestionMark: true}
// }

@Component({
  selector: 'app-login',
  imports: [FormsModule, JsonPipe, NgClass, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  //Template Driven Approach
  private form = viewChild.required<NgForm>('form')
  private destroyRef = inject(DestroyRef)

  // Reactive form Approach
  formReactive = new FormGroup({
    email: new FormControl('', {
      validators:[Validators.required,Validators.email],
      asyncValidators:[emailIsUnique]
    }),
    password: new FormControl('',{
      validators:[Validators.required,Validators.minLength(6),mustContainQuestionMark],
    }),
    gender: new FormControl('',{
      validators:[Validators.required]
    })
  })


  templateDrivenForm = signal<boolean>(true);
  reactiveForm = signal<boolean>(false);


  constructor(){
    if(this.templateDrivenForm()){
        afterNextRender(()=>{
        const saveForm =window.localStorage.getItem("saved-login-form")
        if(saveForm){
          const loadedForm = JSON.parse(saveForm);
          setTimeout(() => {
            Object.keys(this.form().controls).forEach((name)=>{
              this.form().controls[name].setValue(loadedForm[name])
            })
          }, 1);
        }
        const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe(
          {
            next: (value) =>{
              window.localStorage.setItem("saved-login-form",JSON.stringify({email:value.email,password:value.password,gender:value.gender}))
            }
          }
        );
        this.destroyRef.onDestroy(()=>{
          subscription?.unsubscribe()
        })
      })
    }
  }

  ngOnInit() {
      const savedReactiveFormValues = window.localStorage.getItem('reactive-login-form')
      if(savedReactiveFormValues){
        const loadedForm = JSON.parse(savedReactiveFormValues);
        this.formReactive.patchValue({
          email: loadedForm.email,
          password:loadedForm.password,
          gender:loadedForm.gender
        })
      }
{}    const reactiveSubscription= this.formReactive.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem('reactive-login-form',JSON.stringify({email:value.email,password:value.password,gender:value.gender}))
      }
    })

    this.destroyRef.onDestroy(()=>{
      reactiveSubscription.unsubscribe()
    })
  }
  onSubmit(formData: NgForm){
    if(formData.form.valid){
      const emailValue = formData.form.value.email;
      const passwordValue = formData.form.value.password;
      const genderValue = formData.form.value.gender;
      console.log(emailValue,passwordValue,genderValue)
      Object.keys(formData.controls).forEach(formElement => {
        console.log(formData.controls[formElement].valid)
      })
      formData.form.reset();
      formData.form.dirty
    }else{
      console.log("form is invalid")
    }
  }

  
  onReactiveFormSubmit(){
    console.log(this.formReactive)
    const enteredEmail = this.formReactive.value.email;
    const enteredPassword = this.formReactive.value.password;
    const genderValue = this.formReactive.value.gender;
    console.log(enteredEmail,enteredPassword,genderValue)
  }

  get emailIsInvalid(){
    return this.formReactive.controls.email.invalid && this.formReactive.controls.email.touched && this.formReactive.controls.email.dirty
  }

  get passwordIsInvalid(){
    return this.formReactive.controls.password.invalid && this.formReactive.controls.password.touched && this.formReactive.controls.password.dirty
  }

  showHideForm(type: string){
    if(type == 'templateForm'){
      this.templateDrivenForm.set(true);
      this.reactiveForm.set(false)
    }else{
      this.templateDrivenForm.set(false);
      this.reactiveForm.set(true);
    }
  }
}
