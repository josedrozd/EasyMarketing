import { Component, EventEmitter, inject, OnInit, Output, output } from '@angular/core';
import { IgUserInfo } from '../../../core/models/ig-user-info';
import { BehaviorSubject } from 'rxjs';
import { UserInfoService } from '../../../services/temporary/user-info.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsernameCheckService } from '../../../services/backend/instagram/username-check.service';

@Component({
  selector: 'app-profile-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-check.component.html',
  styleUrl: './profile-check.component.css'
})
export class ProfileCheckComponent {

  @Output() igVerified = new EventEmitter<void>();
  private userinfoService = inject(UserInfoService);
  private usernameCheckService = inject(UsernameCheckService);
  locked = false;
  igUserInfo!: IgUserInfo;
  username!:string;
  profilePicUrl!: string;
  message: string = "";

  verifyIG() {
    if (!this.username || this.username === '') return;
    this.usernameCheckService.checkIGUsername(this.username).subscribe({
      next: (response) => {
        this.igUserInfo = response;

        if (this.igUserInfo.isPrivate === null || this.igUserInfo.isPrivate) {
          this.setErrorMsg();
          return;
        }

        this.profilePicUrl = this.igUserInfo.profilePicUrl!;
        this.igVerified.emit();
        this.userinfoService.updateId(this.igUserInfo.id!);
        console.log(this.userinfoService.userId$ + " " + this.igUserInfo.id);
        this.locked = true;
        console.log("Username" + this.userinfoService.username$)
        this.message = "IG verified!";
      },
      error: (err) => {
        this.setErrorMsg();
      }
    });
  }

  onUsernameChange(value: string) {
    this.userinfoService.updateUsername(value);
  }
  setErrorMsg() {

    this.message = "User " + this.username + " not found. Make sure your profile is public.";
  }

  getImageUrl(): string {
    return `https://marketingfacil.com.ar/proxy/`+this.profilePicUrl;
  }

}
