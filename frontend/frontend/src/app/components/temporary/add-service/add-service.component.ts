import { Component } from '@angular/core';
import { PostServiceComponent } from '../post-service/post-service.component';
import { ProfileServiceComponent } from '../profile-service/profile-service.component';
import { CommonModule } from '@angular/common';
import { ProfileCheckComponent } from '../profile-check/profile-check.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-add-service',
  imports: [
    PostServiceComponent, 
    ProfileServiceComponent, 
    CommonModule,
    ProfileCheckComponent,
    FormsModule,
    RouterModule
  ],
  templateUrl: './add-service.component.html',
  styleUrl: './add-service.component.css'
})
export class AddServiceComponent {

  postServiceVisible: boolean = false;
  profileServiceVisible: boolean = false;
  visible: boolean = false;

  addProfileService(){
    this.profileServiceVisible = true;
    this.postServiceVisible = false;
  }

  addPostService(){
    this.profileServiceVisible = false;
    this.postServiceVisible = true;
  }

  becomeVisible() {
    this.visible = true;
  }

}
