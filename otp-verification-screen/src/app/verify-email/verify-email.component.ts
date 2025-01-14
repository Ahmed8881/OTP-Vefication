import { Component, ViewChildren, QueryList, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxSpinnerModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

  email = 'user@example.com'; // Replace with actual user email

  otpArray: string[] = ['', '', '', '', '', ''];
  timer: string = '02:00'; // Initial timer value
  countdown: any;
  isResendDisabled: boolean = false;

  wrongOtpAttempts: number = 0; // Counter for wrong OTP attempts
  maxOtpAttempts: number = 3; // Maximum allowed attempts
  isOtpDisabled: boolean = false; // For disabling OTP input fields

  private destroy$ = new Subject<void>();

  previousUrl: any = '';

  isVerified: any;

  verificationCode: string[] = ['', '', '', '', '',''];
  // email: string = 'example@gmail.com';
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  // isVerified: any;

  @ViewChild('otpInput0, otpInput1, otpInput2, otpInput3, otpInput4, otpInput5') otpInputs!: QueryList<ElementRef>;

  constructor(
    private router: Router,

    private location: Location,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
 
    private activedRoutes: ActivatedRoute,
  ) {
    this.activedRoutes.queryParams.subscribe((params) => {
      this.isVerified = params['isverified'];
    });
  }

  // previousUrl: any = '';
  ngOnInit(): void {
    // this.startCountdown();
    
    //     this.router.events.subscribe((event) => {
    //       if (event instanceof NavigationStart) {
    //         this.previousUrl = event.url;
    //       }
    //     });
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   this.codeInputs.first?.nativeElement?.focus();
    // });

    // if (this.otpInputs && this.otpInputs.length) {
    //   this.otpInputs.first.nativeElement.focus();
    // }
  }

  // private destroy$ = new Subject<void>();

  // countdown: any;
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.countdown);
  }

  // Function for navigation Start
  goBack() {
    this.location.back();
  }
  // Function for navigation End

  // Start countdown timer
  startCountdown() {
    let totalTime = 120;
    this.isResendDisabled = true;
    this.countdown = setInterval(() => {
      if (totalTime > 0) {
        totalTime--;
        const minutes = Math.floor(totalTime / 60)
          .toString()
          .padStart(2, '0');
        const seconds = (totalTime % 60).toString().padStart(2, '0');
        this.timer = `${minutes}:${seconds}`;
      } else {
        clearInterval(this.countdown);
        this.timer = 'Expired';
        this.isResendDisabled = false;
        // Optionally disable input or notify user
      }
    }, 1000);
  }


  moveToNext(nextInput: HTMLInputElement): void {
    if (nextInput) {
      setTimeout(() => nextInput.focus(), 40);
    }
  }

  moveToPrevious(previousInput: HTMLInputElement): void {
    if (previousInput) {
      setTimeout(() => previousInput.focus(), 40);
    }
  }

  isOtpComplete(): boolean {
    return this.otpArray.every((char) => char !== '');
  }

  // Verify OTP
  verifyOtp() {

    const otpCode = this.otpArray.join('');

  }

  private verifyOtpAfterSignUp(payload: any) {
      this.spinner.show();

    }
  
    private verifyOtpAfterForgetPassword(payload: any) {
      this.spinner.show();
 
    }

    // Resend OTP
  resendCode() {
    this.otpArray = ['', '', '', '', '', ''];
    this.timer = '02:00';
    this.startCountdown();
 
  }
  resendVerifyOtp() {
    this.spinner.show();

  }


}