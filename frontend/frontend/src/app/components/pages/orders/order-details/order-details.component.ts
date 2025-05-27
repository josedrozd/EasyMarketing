import { Component } from '@angular/core';
import { UsernameCheckService } from '../../../../services/backend/instagram/username-check.service';
import { OrderData, OrderDataService } from '../../../../services/order-data.service';
import { IgUserInfo } from '../../../../core/models/ig-user-info';
import { take } from 'rxjs';

@Component({
  selector: 'app-order-details',
  imports: [],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {

  userInfoValue!: IgUserInfo;
  orderData!: OrderData;
  username!: string;

  constructor(
    private orderDataService: OrderDataService,
    private usernameCheckService: UsernameCheckService
  ) {

  }

  ngOnInit() {
    this.orderDataService.orderData$.pipe(take(1)).subscribe(data => {
      this.orderData = data;
      this.username = this.orderData.username!;
      
      if (this.orderData.platform === "instagram") {
        this.usernameCheckService.checkIGUsername(this.orderData.username!).subscribe(res => {
          this.userInfoValue = res;
          console.log(this.userInfoValue.id);
          console.log(this.userInfoValue.username);
          console.log(this.userInfoValue.isPrivate);
          console.log(this.userInfoValue.profilePicUrl);
        });
      } else {
        console.log(this.orderData.platform);
      }
    });
  }

  ngOnDestroy() {
    const currentData = this.orderDataService.getSnapshot();
    this.orderDataService.setAll({
      ...currentData,
      username: null,
      mail: null,
      name: null,
      lastname: null,
      platform: null
    });
  }

}
