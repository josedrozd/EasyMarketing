import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

    faqs = [
    {
      question: 'What is Lorem Ipsum?',
      answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      expanded: false
    },
    {
      question: 'Why do we use it?',
      answer: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
      expanded: false
    },
    {
      question: 'Where does it come from the from from the where?',
      answer: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
      expanded: false
    }
  ];

  toggle(faq: any) {
    faq.expanded = !faq.expanded;
  }

}
