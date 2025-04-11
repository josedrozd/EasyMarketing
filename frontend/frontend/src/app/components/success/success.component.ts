import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseStatus, StatusService } from '../../services/backend/purchases/status.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success',
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {

  msg: string = "Loading...";
  
  constructor(
    private route: ActivatedRoute,
    private statusService: StatusService
  ) {}

  ngOnInit(): void {
    this.msg = this.statusService.getMessageFromState();

    this.statusService.updatePurchaseStatus(
      this.route.snapshot.queryParamMap.get('external_reference')!, 
      +this.route.snapshot.queryParamMap.get('payment_id')!
    ).subscribe();
  }
  
}
