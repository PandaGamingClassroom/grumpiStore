import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GrumpiService {
  private apiUrl = 'http://localhost:3000/upload';
  private imageUrlEndpoint = 'http://localhost:3000/getImageUrls';
  private imageMedalsEndpoint = 'http://localhost:3000/getImageMedals';
  imageUrl: string = '';

  constructor(private http: HttpClient) {}

  /**
   * Función para guardar las imágenes nuevas de los Grumpi
   * @param datosGrumpi
   * @returns
   */
  subirGrumpi(datosGrumpi: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, datosGrumpi);
  }

  getImageUrls(): Observable<{ imageUrls: string[] }> {
    return this.http.get<{ imageUrls: string[] }>(this.imageUrlEndpoint);
  }

  /**
   * Función para obtener las imágenes de las medallas almacenadas
   * @returns lista de imágenes
   */
  getImageMedals(): Observable<{ imageUrls: string[] }> {
    return this.http.get<{ imageUrls: string[] }>(this.imageMedalsEndpoint);
  }
}
