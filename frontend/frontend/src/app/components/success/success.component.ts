import { Component, Injector, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseStatus, StatusService } from '../../services/backend/purchases/status.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ProcessPurchaseService } from '../../services/backend/purchases/process-purchase.service';
import { interval, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-success',
  imports: [CommonModule,
    RouterModule
  ],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {

  pollingSubscription!: Subscription;
  msg: string = "Cargando...";
  expanded: boolean = false;
  platformId: Object;
  started: boolean = false;
  processing: boolean = false;
  purchaseStatus!: PurchaseStatus;
  
  constructor(
    private processPurchaseService: ProcessPurchaseService,
    private route: ActivatedRoute,
    private statusService: StatusService,
    private injector: Injector
  ) {
    this.platformId = this.injector.get(PLATFORM_ID);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.statusService.updatePurchaseStatus(
        this.route.snapshot.queryParamMap.get('external_reference')!, 
        +this.route.snapshot.queryParamMap.get('payment_id')!
      ).subscribe({
        next: (result) => {
          this.purchaseStatus = result;
          this.started = result.isStarted || result.isCompleted || this.atLeastOneIsProcessed();
          this.processing = result.isProcessing;
          this.msg = this.statusService.getMessageFromState();
          if(this.purchaseStatus.isProcessing) 
            this.startPolling();
        },
        error: (err) => {
          console.error("Error loading purchase status", err);
        }
      });
    }
  }

  processPurchase() {
    this.started = true;
    this.processing = true;
    this.processPurchaseService.process(this.purchaseStatus.id)
      .subscribe();
    this.startPolling();
  }

  startPolling() {
    this.pollingSubscription = interval(2400)
      .pipe(
        switchMap(() => this.statusService.retrievePurchaseStatus(this.purchaseStatus.id))
      )
      .subscribe(response => {
        this.purchaseStatus = response;
        console.log("Poll interval finished.")
        if (!response.isProcessing) {
          console.log("Stoping poll.")
          this.stopPolling();
        }
      });
  }

  stopPolling() {
    this.pollingSubscription?.unsubscribe();
    this.processing = false;
    if(this.purchaseStatus.isCompleted)
      this.msg = 'Tu compra ya fue procesada. Gracias por confiar en nosotros! ❤️';
    else {
      this.msg = 'Hubo un error al procesar algunos items de la compra. Por favor vuelva a reprocesar. Si el problema persiste, contactese con nosotros.';
    }
  }

  toggle() {
    this.expanded = !this.expanded;
  }

  getItemUnitState(processed: boolean): string {
    if(!this.started) {  
      return '-';
    } else if(processed) {
      return '✅';
    } else if (this.purchaseStatus.isProcessing || this.processing) {
      return '🕒';
    } else {
      return '❌';
    }
  }

  atLeastOneIsProcessed(): boolean {
    return this.itemsProcessed() > 0;
  }

  itemsProcessed(): number {
    return this.purchaseStatus.items.filter(item => item.processed).length;
  }

  itemsLength(): number {
    return this.purchaseStatus.items.length;
  }
  
}
