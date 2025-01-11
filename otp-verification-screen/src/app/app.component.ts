import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VerifyEmailComponent } from "./verify-email/verify-email.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VerifyEmailComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'otp-verification-screen';
}
