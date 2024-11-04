import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentProd } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: string[] = [];
  private apiUrl = environmentProd.apiUrl;
  constructor(private http: HttpClient) {}

  addNotification(message: string) {
    this.notifications.push(message);
  }

  getNotifications(): string[] {
    return this.notifications;
  }

  clearNotifications() {
    this.notifications = [];
  }

  getNotificationsFromServer(professorId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}notifications/${professorId}`);
  }
}
