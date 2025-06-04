import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface CartItemUnit {
  username: string;
  serviceId: number;
  serviceName: string;
  url: string;
  provider: string;
  quantity: number;
  processed: boolean;
}

export interface PurchaseStatus {
  id: number;
  isApproved: boolean;
  isCompleted: boolean;
  isProcessing: boolean;
  isStarted: boolean;
  isCanceled: boolean;
  items: CartItemUnit[];
}

const MESSAGE_KEY = makeStateKey<string>('purchaseMessage');

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  private baseUrl = environment.apiUrl;
  
  constructor(
    private http: HttpClient,
    private state: TransferState
  ) {}

  updatePurchaseStatus(tokenId: string, paymentId: number): Observable<PurchaseStatus> {

    const url = `${this.baseUrl}/api/purchases/tokens/${tokenId}/status`;

    return this.http.put<PurchaseStatus>(url, {}, { params: { paymentId } }).pipe(
      tap((status) => {
        let msg = '';
        if (status.isCanceled) {
          msg = 'Tu compra fue cancelada. Comunicate con nosotros para mas información.'
        } else if (!status.isApproved) {
          msg = 'Aun no pudimos confirmar el pago. Espera unos segundos y refresca la página. Si el problema persiste contactate con nosotros!';
        } else if (status.isCompleted) {
          msg = 'Tu compra ya fue procesada, en breves deberias ver tus productos reflejados. ¡Gracias por confiar en nosotros! ❤️';
        } else if (status.isStarted && !status.isProcessing) {
          msg = 'Hubo un error al procesar algunos items de la compra. Por favor vuelva a reprocesar. Si el problema persiste, contactese con nosotros.'; 
        } else {
          msg = 'Pago confirmado! Ya puedes procesar tu compra.';
        }
        this.state.set(MESSAGE_KEY, msg);
      })
    );
  }

  retrievePurchaseStatus(purchaseId: number): Observable<PurchaseStatus> {

    const url = `${this.baseUrl}/api/purchases/${purchaseId}/status`;

    return this.http.get<PurchaseStatus>(url, {}).pipe(
      map(status => ({
              id: status.id,
              isApproved: status.isApproved,
              isCompleted: status.isCompleted,
              isProcessing: status.isProcessing,
              isStarted: status.isStarted,
              isCanceled: status.isCanceled,
              items: status.items
      }))
    );
  }

  cancelPurchase(purchaseId: number): Observable<boolean> {
    const url = `${this.baseUrl}/api/purchases/${purchaseId}/cancel`;
    return this.http.put<boolean>(url, {});
  }

  getMessageFromState(): string {
    const msg = this.state.get(MESSAGE_KEY, '');
    return msg;
  }
}
