import { Component } from '@angular/core';
import { VerifyEmailComponent } from "./verify-email/verify-email.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VerifyEmailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'otp-verification-screen';
}
