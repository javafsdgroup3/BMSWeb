import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'angular-toastify';


@Component({
  selector: 'app-verify-password',
  templateUrl: './verify-password.component.html',
  styleUrls: ['./verify-password.component.css']
})
export class VerifyPasswordComponent {


  registerForm!: FormGroup;

  constructor(
    //private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
   private _toastService: ToastService,
   // private loader : LoadermodelService
  ) {}

  ngOnInit(): void {
  
    this.registerForm = this.fb.group({
      accountNumber: ['', Validators.required],
      pin: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      // Add other form controls if needed
    }, { 

      validator: passwordMismatch('password', 'confirmPassword')

    }
  );
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    // if (this.registerForm.invalid) {
    //    return;
    //  }

    // Call the API service to register the user
    this.authService.verifyPassword(this.registerForm.value).subscribe(
      (response: any) => {
        console.log(response)
        this._toastService.success("Updated Successfully");
      },
      (error: any) => {
        console.error('Password not updated', error);
        this._toastService.error("Password not updated");
      }
    );
  }


}


function passwordMismatch(controlName: string, matchingControlName: string){
  return (formGroup: FormGroup) => { const control =
  formGroup.controls[controlName]; const matchingControl =
  formGroup.controls[matchingControlName]; if (matchingControl.errors &&
  !matchingControl.errors.passwordMismatch) { return; } if (control.value !==
  matchingControl.value) { matchingControl.setErrors({ passwordMismatch: true });
  } else { matchingControl.setErrors(null); } } }