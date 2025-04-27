import { Injectable, makeStateKey, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface PurchaseStatus {
  id: number;
  isApproved: boolean;
  isCompleted: boolean;
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
        if (!status.isApproved) {
          msg = 'Aun no pudimos confirmar el pago. Espera unos segundo y refresca la página. Si el problema persiste contactate con nosotros!';
        } else if (status.isCompleted) {
          msg = 'Tu compra ya fue procesada. Gracias por confiar en nosotros! ❤️';
        } else {
          msg = 'Pago confirmado! Ya puedes procesar tu compra.';
        }
        this.state.set(MESSAGE_KEY, msg);
      })
    );
  }

  getMessageFromState(): string {
    const msg = this.state.get(MESSAGE_KEY, '');
    return msg;
  }
}
