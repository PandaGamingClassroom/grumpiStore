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
  private imageEnergiesEndpoint = 'http://localhost:3000/getImageEnergies';
  private imageCombatObjects = 'http://localhost:3000/getImageCombatObjects';

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

  /**
   * Función para obtener las imágenes de los Grumpi
   * @returns lista de imágenes
   */
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

  /**
   * Función para obtener la lista de imágenes almacenadas de las energías
   * @returns listado de imágenes de energías
   */
  getImageEnergies(): Observable<{ imageUrls: string[] }> {
    return this.http.get<{ imageUrls: string[] }>(this.imageEnergiesEndpoint);
  }

  /**
   * Función para obtener la lista de imágenes almacenadas de los objetos de combate
   * @returns listado de imágenes de los objetos de combate
   */
  getCombatObjects(): Observable<any> {
    return this.http.get<any>(this.imageCombatObjects);
  }
}
