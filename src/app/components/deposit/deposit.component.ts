import { Component, OnInit , Output, EventEmitter , ChangeDetectorRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { LoadermodelService } from 'src/app/services/loadermodel.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent implements OnInit {
  depositForm!: FormGroup;
showAccountDetail: any;
@Output() depositSuccess: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private _toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loader: LoadermodelService // Inject the LoaderService here
  ) { }
  ngOnInit(): void {
    this.initDepositForm();
  }

  initDepositForm(): void {
    this.depositForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]], // Validate that amount is a positive number
      pin: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
  }

   // Method to handle successful deposit event
   handleDepositSuccess() {
    // Trigger change detection to update the view
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if (this.depositForm?.valid) {
      const amount = this.depositForm.get('amount')?.value;
      const pin = this.depositForm.get('pin')?.value;

      if (amount !== null && pin !== null) {
        this.loader.show('Depositing...'); // Show the loader before making the API call
        this.apiService.deposit(amount, pin).subscribe(
          (response) => {
            this.loader.hide(); // Hide the loader on successful deposit
            // Handle successful deposit if needed
            this._toastService.success(response.msg);
            this.depositForm.reset();
            console.log('Deposit successful!', response);
          },
          (error) => {
            this.loader.hide(); // Hide the loader on deposit request failure
            // Handle error if the deposit request fails
            this._toastService.success(error.error || 'Deposit failed');
            console.error('Deposit failed:', error);
          }
        );
      }
    }

    this.initDepositForm();
  //  accountDetail.refresh();
    this.depositSuccess.emit();
  }
 
}
