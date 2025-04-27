import { Component, Injector, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StatusService } from '../../services/backend/purchases/status.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-success',
  imports: [CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {

  msg: string = "Loading...";
  platformId: Object;
  
  constructor(
    private route: ActivatedRoute,
    private statusService: StatusService,
    private injector: Injector
  ) {
    this.platformId = this.injector.get(PLATFORM_ID);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.msg = this.statusService.getMessageFromState();

      this.statusService.updatePurchaseStatus(
        this.route.snapshot.queryParamMap.get('external_reference')!, 
        +this.route.snapshot.queryParamMap.get('payment_id')!
      ).subscribe();
    }
  }
  
}
