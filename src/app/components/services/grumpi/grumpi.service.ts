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
  private imageEvolutionObjects = 'http://localhost:3000/getEvoOBjects';
  private getGrumpi_list = 'http://localhost:3000/getGrumpis';
  private rewardsEndpoint = 'http://localhost:3000/getRewards';
  private encargadosEndpoint = 'http://localhost:3000/getRewards';
  private distintivosEndpoint = 'http://localhost:3000/getLeagueBadges';

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
   * Función para obtener los datos de los Grumpis desde la Base de Datos
   * @returns lista de grumpis
   */
  getGrumpis(): Observable<any> {
    return this.http.get<any>(this.getGrumpi_list);
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

  getEvolutionObjects(): Observable<any> {
    return this.http.get<any>(this.imageEvolutionObjects);
  }

  getRewards(): Observable<any> {
    return this.http.get<any>(this.rewardsEndpoint);
  }

  getEncargados(): Observable<any> {
    return this.http.get<any>(this.encargadosEndpoint);
  }

  getDistintivos(): Observable<any> {
    return this.http.get<any>(this.distintivosEndpoint);
  }
}
