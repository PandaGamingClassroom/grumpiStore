import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

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

  /**
   * Función para guardar un nuevo entrenador
   *
   * @param name
   * @param password
   * @returns
   */
  postTrainer(name: string, password: string) {
    const body = { name, password }; // Objeto con los datos a enviar al servidor
    return this.http.post(this.apiUrl, body);
  }

  /**
   * Función para actualizar la información del entrenador.
   *
   * @param trainerName
   * @param trainerData
   * @returns
   */
  updateTrainer(trainerName: string, trainerData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}trainers/update/${trainerName}`,
      trainerData
    );
  }

  /**
   * Función para eliminar un entrenador.
   *
   * @param id
   * @returns
   */
  eliminarRegistro(trainerName: string) {
    const url = this.apiUrl + `user/${trainerName}`;
    return this.http.delete(url);
  }

  assignCreatureToTrainer(
    trainerName: string,
    creatureName: string
  ): Observable<any> {
    const url = this.apiUrl + 'assign-creature';
    const body = { trainerName, creatureName };

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200 && error.error instanceof ProgressEvent) {
          // El error se produce debido a que no se pudo analizar la respuesta como JSON
          // Maneja este caso aquí, por ejemplo, mostrando un mensaje de error adecuado al usuario
          return throwError('Error al procesar la respuesta del servidor.');
        } else {
          // El error es de otro tipo, por lo que simplemente lo relanzamos
          return throwError(error);
        }
      })
    );
  }

  /**
   * Función para asignar una energía a un entrenador
   *
   * @param trainerName Recibe el nombre del entrenador
   * @param energieName Recibe el nombre de la energía
   * @returns
   */
  assignEnergie(trainerName: string, energie: any): Observable<any> {
    const url = `${this.apiUrl}assign-energie`;
    return this.http.post<any>(url, { trainerName, energie });
  }

  assignMedalToTrainer(
    trainerName: string,
    medalName: string
  ): Observable<any> {
    const url = this.apiUrl + 'assign-medal';
    const body = { trainerName, medalName };

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200 && error.error instanceof ProgressEvent) {
          return throwError('Error al procesar la respuesta del servidor.');
        } else {
          return throwError(error);
        }
      })
    );
  }

  assignCombatObjectsToTrainer(
    trainerName: string,
    combatObject: string
  ): Observable<any> {
    const url = this.apiUrl + 'assign-combatObjects';
    const body = { trainerName, combatObject };

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200 && error.error instanceof ProgressEvent) {
          return throwError('Error al procesar la respuesta del servidor.');
        } else {
          return throwError(error);
        }
      })
    );
  }

  /**
   * Función para obtener un entrenador por su nombre
   */
  getTrainerByName(nombre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}trainer/${nombre}`);
  }

  /**
   * Función para asignar los grumpidólares a un entrenador
   */
  assignGrumpidolaresToTrainer(
    trainerName: string,
    grumpidolares: number
  ): Observable<any> {
    const url = `${this.apiUrl}assign-grumpidolares`;
    const body = { trainerName, grumpidolares };

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200 && error.error instanceof ProgressEvent) {
          return throwError('Error al procesar la respuesta del servidor.');
        } else {
          return throwError(error);
        }
      })
    );
  }

  assignGrumpidolaresAfterBuyToTrainer(
    trainerName: string,
    grumpidolares: number
  ): Observable<any> {
    const url = `${this.apiUrl}assignGrumpidolares-after-buy`;
    const body = { trainerName, grumpidolares };

    return this.http.post<any>(url, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 200 && error.error instanceof ProgressEvent) {
          return throwError('Error al procesar la respuesta del servidor.');
        } else {
          return throwError(error);
        }
      })
    );
  }
}
