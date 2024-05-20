import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private apiUrl = 'http://localhost:3000/'; // URL del servidor donde se encuentra la API REST

  constructor(private http: HttpClient) {}

  /**
   * Llamada al servicio para obtener el listado de entrenadores.
   *
   * @returns Listado de entrenadores
   */
  getTrainers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener los entrenadores:', error);
        throw error;
      })
    );
  }

  postTrainer(name: string, password: string) {
    const body = { name, password }; // Objeto con los datos a enviar al servidor
    return this.http.post(this.apiUrl, body);
  }

  eliminarRegistro(id: number) {
    const url = this.apiUrl + `user/${id}`;
    return this.http.delete(url);
  }
}
