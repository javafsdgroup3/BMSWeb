import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { AuthService } from 'src/app/services/auth.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';
import { environment } from 'src/environment/environment';
import { AbstractControl,FormControl, ValidatorFn} from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  loginForm!: FormGroup;
  showPassword: boolean = false;
  authTokenName = environment.tokenName;
  registerForm!: FormGroup;
  showRegistrationData = false;
  registrationData: any;
  print  =  console

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private _toastService: ToastService,
    private loader : LoadermodelService
  ) {}

  ngOnInit(): void {
    this.initLoginForm();
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      // Add other form controls if needed
    }, { 

      validator: passwordMismatch('password', 'confirmPassword')

    }
  );
  }

  initLoginForm(): void {
    sessionStorage.clear();
    this.loginForm = this.fb.group({
      accountNumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { accountNumber, password } = this.loginForm.value;
      this.loader.show("Logging...");
      this.authService.login(accountNumber, password).subscribe(
        (response: any) => {
          this.loader.hide();
          // Handle successful login here
          // Save the token from the response if needed
          if(response.token){

            console.log(response);
          this._toastService.success('Account LoggedIn');
          setTimeout(() => {
            
          const token = response.token;
          console.log(token);
          localStorage.setItem(this.authTokenName, token);
           // Hide the loader on successful login
          this.router.navigate(['/dashboard']);
        }, 700);
          }
          else{
            this._toastService.error('Invalid Credentials');
         
          }
          
          // Redirect to the desired page or perform any other action
        },
        (error: any) => {
          // Handle login failure here
          this._toastService.error('Invalid Credentials');
          console.error('Login error:', error);
          this.loader.hide(); // Hide the loader on login error
        }
      );
    }
  }
  

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmitSignIn() {
    if (this.registerForm.invalid) {
      return;
    }

    // Call the API service to register the user
    this.authService.registerUser(this.registerForm.value).subscribe(
      (response: any) => {
        // Store the registration data and show it on the page
        this.registrationData = response;
        this.showRegistrationData = true;
      },
      (error: any) => {
        console.error('Registration failed:', error);
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