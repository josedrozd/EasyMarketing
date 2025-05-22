import { Component } from '@angular/core';

@Component({
  selector: 'app-social-footer',
  imports: [],
  templateUrl: './social-footer.component.html',
  styleUrl: './social-footer.component.css'
})
export class SocialFooterComponent {

  openLink(url: string) {
    window.open(url, '_blank');
  }
  
}
