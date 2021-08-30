import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { timer } from 'rxjs';
import { first, scan, takeWhile } from 'rxjs/operators';
import { LoginService } from './../../services/login/login.service'
import { UserModel } from '..';
import { Router } from '@angular/router';



enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  forgotPasswordOTP: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  isOTPSent:Boolean = false;
  resendOtpBtn:Boolean= false;

  timer$: Observable<number> ;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  hasError: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }
  get resetform() {
    return this.forgotPasswordOTP.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
    this.forgotPasswordOTP = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }
startCounter(){
this.timer$ = timer(0, 1000).pipe(
  scan((acc)=>{
    if(acc==1){
      this.resendOtpBtn = true
    }
    return --acc
  }, 120),
  takeWhile(x => x >= 0)
)
}
resendOtp(){
  this.isOTPSent = false;
  this.resendOtpBtn = false;
  this.startCounter();
  this.loginService.sendOtp({email:this.f.email.value}).subscribe((data) => {
    if (data && data.token) {
      const loginSubscr = this.authService
      .login('admin@demo.com', 'demo')
      .pipe(first())
      .subscribe((user: UserModel) => {
    
      });
    } else {
      
    }
  });
}
  submit() {
    this.isOTPSent = true;
    this.startCounter();
    this.loginService.sendOtp({email:this.f.email.value}).subscribe((data) => {
      if (data && data.token) {
        const loginSubscr = this.authService
        .login('admin@demo.com', 'demo')
        .pipe(first())
        .subscribe((user: UserModel) => {
      
        });
      } else {
        
      }
    });
   
  }
  submitOtp() {
    this.loginService.verifyotp({email:this.resetform.email.value}).subscribe((data) => {
      if (data ) {
        const loginSubscr = this.authService
        .login('admin@demo.com', 'demo')
        .pipe(first())
        .subscribe((user: UserModel) => {
          if (user) {
            this.router.navigate(['/']);
          } 
        });
      } else {
        this.hasError = true;
      }
    });
  }
}
