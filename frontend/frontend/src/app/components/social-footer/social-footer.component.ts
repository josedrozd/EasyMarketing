import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-social-footer',
  imports: [
    CommonModule
  ],
  templateUrl: './social-footer.component.html',
  styleUrl: './social-footer.component.css'
})
export class SocialFooterComponent {

  logoFilter = 'invert(14%) sepia(8%) saturate(2013%) hue-rotate(201deg) brightness(93%) contrast(84%)';

  openLink(url: string) {
    window.open(url, '_blank');
  }
  
}
