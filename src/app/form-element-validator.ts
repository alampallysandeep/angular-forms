import { AbstractControl, ValidationErrors } from "@angular/forms";
import { of } from "rxjs";

export function mustContainQuestionMark(control:AbstractControl) : ValidationErrors | null{
    if(control.value.includes('?')){
        return null;
    }

    return {doesNotContainQuestionMark:true}
}

export function emailIsUnique(control:AbstractControl){
    if(control.value === 'test@gmail.com'){
        return of(null)
    }

    return of({notUnique:true})
}

export function equalValues(controlName1: string,controlName2:string){
    return (control: AbstractControl) => {
        const val1 = control.get(controlName1)?.value;
        const val2 = control.get(controlName2)?.value;
        if (val1 === val2) {
            return null
        }
        return { passwordDoesNotMatch: true }
    }
}