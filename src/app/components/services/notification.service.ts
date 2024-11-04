import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: string[] = [];

  addNotification(message: string) {
    this.notifications.push(message);
  }

  getNotifications(): string[] {
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
  }


}
