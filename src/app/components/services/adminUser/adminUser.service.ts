import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminUserService {
  private adminUserSubject = new BehaviorSubject<boolean>(false);
  adminUser$ = this.adminUserSubject.asObservable();

  setAdminUser(isAdmin: boolean) {
    this.adminUserSubject.next(isAdmin);
  }
}
