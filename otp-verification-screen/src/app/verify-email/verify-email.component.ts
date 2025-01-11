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
    this.startCountdown();
    
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationStart) {
            this.previousUrl = event.url;
          }
        });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.codeInputs.first?.nativeElement?.focus();
    });

    if (this.otpInputs && this.otpInputs.length) {
      this.otpInputs.first.nativeElement.focus();
    }
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
    let totalTime = 120; // 2 minutes in seconds
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
  // Move to the next input field

  // Check if OTP is complete
  // otpArray: string[] = ['', '', '', '', '', ''];
  isOtpComplete(): boolean {
    return this.otpArray.every((char) => char !== '');
  }

  // Verify OTP
  verifyOtp() {

    const otpCode = this.otpArray.join('');
    const payload = {
      otp: otpCode,
    };

  
  }


    // Resend OTP
  resendCode() {
    this.otpArray = ['', '', '', '', '', ''];
    this.timer = '02:00';
    this.startCountdown();
    this.resendVerifyOtp();
  }

  // Handle the paste event
  handlePaste(event: ClipboardEvent) {
    event.preventDefault(); // Prevent the default paste behavior
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData?.getData('text') || '';

    // Only process if the pasted text length matches or is less than the number of inputs
    if (pastedText.length <= this.otpArray.length) {
      for (let i = 0; i < pastedText.length; i++) {
        this.otpArray[i] = pastedText[i];

        // Automatically set the value in the respective input fields
        const inputElement =
          document.querySelectorAll<HTMLInputElement>('.otp-input')[i];
        if (inputElement) {
          inputElement.value = pastedText[i];
        }
      }

      // Focus on the next empty input field
      const nextEmptyIndex = pastedText.length;
      if (nextEmptyIndex < this.otpArray.length) {
        const nextInput =
          document.querySelectorAll<HTMLInputElement>('.otp-input')[
          nextEmptyIndex
          ];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  }

  resendVerifyOtp() {
    this.spinner.show();

  }



  // onDigitChange(event: Event, index: number): void {
  //   const inputEl = event.target as HTMLInputElement;
  //   let value = inputEl.value;

  //   // If user typed more than one char, keep only the last
  //   if (value.length > 1) {
  //     value = value.slice(-1);
  //   }

  //   // Store that single digit in the array
  //   this.verificationCode[index] = value;
  //   inputEl.value = value;

  //   // Focus next input if this one is not empty and isn't the last input
  //   if (value && index < this.verificationCode.length - 1) {
  //     const inputsArray = this.codeInputs.toArray();
  //     inputsArray[index + 1]?.nativeElement?.focus();
  //   }
  // }
  // onKeyDown(event: KeyboardEvent, index: number): void {
  //   const input = event.target as HTMLInputElement;

  //   if (event.key === 'Backspace') {
  //     if (!input.value && index > 0) {
  //       const inputs = this.codeInputs.toArray();
  //       this.verificationCode[index - 1] = '';
  //       inputs[index - 1].nativeElement.value = '';
  //       inputs[index - 1].nativeElement.focus();
  //       event.preventDefault();
  //     }
  //   } else if (event.key === 'ArrowLeft' && index > 0) {
  //     const inputs = this.codeInputs.toArray();
  //     inputs[index - 1].nativeElement.focus();
  //     event.preventDefault();
  //   } else if (event.key === 'ArrowRight' && index < this.verificationCode.length - 1) {
  //     const inputs = this.codeInputs.toArray();
  //     inputs[index + 1].nativeElement.focus();
  //     event.preventDefault();
  //   }
  // }

  // handlePaste(event: ClipboardEvent): void {
  //   event.preventDefault();
  //   const pastedData = event.clipboardData?.getData('text');
  //   if (!pastedData) return;

  //   const numbers = pastedData.replace(/\D/g, '').slice(0, this.verificationCode.length);
  //   this.verificationCode = [...numbers.padEnd(this.verificationCode.length, '')];

  //   const inputs = this.codeInputs.toArray();
  //   this.verificationCode.forEach((value, index) => {
  //     inputs[index].nativeElement.value = value;
  //   });

  //   const nextEmptyIndex = this.verificationCode.findIndex(val => !val);
  //   const focusIndex = nextEmptyIndex === -1 ? this.verificationCode.length - 1 : nextEmptyIndex;
  //   inputs[focusIndex].nativeElement.focus();
  // }

  // resendCode() {
  //   console.log('Resending verification code');
  // }

  // onVerify() {
  //   const code = this.verificationCode.join('');
  //   if (code.length === this.verificationCode.length) {
  //     const payload = {
  //       otp: code,
  //     };

  //     // Check the previous URL and call the appropriate function
  //   if (this.isVerified === 'false') {
  //     this.verifyOtpAfterForgetPassword(payload);
  //   } else if (this.isVerified === 'true') {
  //     this.verifyOtpAfterSignUp(payload);
  //   } else {
  //   }


  //   }
  // }
}