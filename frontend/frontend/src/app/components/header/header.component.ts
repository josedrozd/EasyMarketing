import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  menuOpen = false;
  dropdownOpen = false;

  @ViewChild('menuButton') menuButtonRef!: ElementRef;
  @ViewChild('navRef') navRef!: ElementRef;
  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  toggleMenu() {
    event?.stopPropagation();
    this.menuOpen = !this.menuOpen;
    if (!this.menuOpen) this.dropdownOpen = false;
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeMenu() {
    this.menuOpen = false;
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;

    if (this.menuButtonRef && this.menuButtonRef.nativeElement.contains(target)) return;

    if (this.dropdownOpen && !this.dropdownRef.nativeElement.contains(target)) {
      this.dropdownOpen = false;
    }

    if (this.menuOpen &&
        !this.navRef.nativeElement.contains(target) &&
        !this.dropdownRef.nativeElement.contains(target)) {
      this.menuOpen = false;
      this.dropdownOpen = false;
    }
  }

}
