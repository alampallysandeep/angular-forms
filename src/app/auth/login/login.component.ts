import { JsonPipe } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  imports:[FormsModule,JsonPipe],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form')
  private destroyRef = inject(DestroyRef)
  templateDrivenForm = signal<boolean>(false);
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
