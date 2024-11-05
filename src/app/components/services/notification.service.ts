import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { environmentProd } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: string[] = [];
  private apiUrl = environmentProd.apiUrl;
  private notificationsSubject = new BehaviorSubject<
    Array<{ message: string } | string>
  >([]);
  notifications$ = this.notificationsSubject.asObservable();
  constructor(private http: HttpClient) {}

  addNotification(message: string) {
    this.notifications.push(message);
  }

  getNotifications() {
    this.http
      .get<Array<{ message: string } | string>>('/notifications')
      .subscribe(
        (notifications) => this.notificationsSubject.next(notifications),
        (error) => console.error('Failed to fetch notifications', error)
      );
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
  }

  getNotificationsFromServer(professorId: number): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}notifications/${professorId}`)
      .pipe(
        tap((notifications) => this.notificationsSubject.next(notifications)),
        catchError((error) => {
          console.error('Error al obtener notificaciones del servidor:', error);
          return of([]); // Regresar un arreglo vacío en caso de error
        })
      );
  }
}
