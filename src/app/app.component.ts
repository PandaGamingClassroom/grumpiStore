import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CustomOverlayContainer } from './custom-overlay-container';
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  providers: [{ provide: OverlayContainer, useClass: CustomOverlayContainer }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly VAPID_PUBLIC_KEY =
    'BFD_VPxiPRpJzte77znqB9zm3v6acV1fQUSyFo-jdOQNi_GKhxVgaKJfvCFSrAdX9XTa-5NrBbYhSbIKkeyPRPs';

  constructor(private swPush: SwPush, private http: HttpClient) {}

  requestNotificationPermission() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((subscription) => {
        // Envía la suscripción al servidor para almacenarla
        this.saveSubscription(subscription);
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }

  saveSubscription(subscription: PushSubscription) {
    // Envía la suscripción al servidor para almacenarla en la base de datos
    this.http
      .post('/api/save-subscription', { subscription, professorId: '12345' })
      .subscribe({
        next: () => console.log('Subscription saved successfully.'),
        error: (err) => console.error('Error saving subscription', err),
      });
  }
}
