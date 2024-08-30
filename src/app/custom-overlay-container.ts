import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomOverlayContainer extends OverlayContainer {
  
  // Agrega el modificador 'override' para indicar que este método reemplaza uno en la clase base
  override _createContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container');

    // Aplica el contenedor dentro del body
    document.body.appendChild(container);

    this._containerElement = container;
  }
}
