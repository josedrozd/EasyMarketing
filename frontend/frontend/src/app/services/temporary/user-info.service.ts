import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private usernameSubject = new BehaviorSubject<string>("");
  username$ = this.usernameSubject.asObservable();
  private userIdSubject = new BehaviorSubject<string>("");
  userId$ = this.userIdSubject.asObservable();

  updateUsername(username: string) {
    this.usernameSubject.next(username);
  }

  updateId(id: string){
    this.userIdSubject.next(id);
  }


}
