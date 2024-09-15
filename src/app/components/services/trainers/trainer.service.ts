import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environmentProd } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TrainerService {
  private apiUrl = environmentProd.apiUrl;
  // private apiUrl = 'http://localhost:3000/'; // URL del servidor donde se encuentra la API REST
  private apiUrl_NewUser = environmentProd.apiUrl + '/new-user/';

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
  postTrainer(trainer: any): Observable<any> {
    return this.http
      .post<any>(
        `${this.apiUrl}profesores/${trainer.id_profesor}/entrenadores`,
        trainer
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al agregar el entrenador:', error);
          return throwError(error);
        })
      );
  }

  postNewUser(name: string, password: string, rol: string) {
    const body = { name, password, rol }; // Objeto con los datos a enviar al servidor
    return this.http.post(this.apiUrl_NewUser, body);
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
   * Función para actualizar solo la contraseña del profesor.
   *
   * @param professorName
   * @param professorData
   * @returns
   */
  updateProfessor(professorName: string, professorData: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}profesors/update/${professorName}`,
      professorData
    );
  }

  /**
   * Función para actualizar todos los datos del profesor.
   *
   * @param professorName
   * @param professorData
   * @returns
   */
  updateAllDataProfessor(
    professorName: string,
    professorData: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}profesors/update_all_data/${professorName}`,
      professorData
    );
  }

  /**
   * Función para eliminar un entrenador.
   *
   * @param id
   * @returns
   */
  eliminarRegistro(trainerName: string) {
    const url = `${this.apiUrl}user/${trainerName}`;
    return this.http.delete(url);
  }

  /**
   * Función para eliminar a un profesor
   *
   * @param professorName Recibe el nombre del profesor a eliminar
   * @returns Devuelve la lista de profesores actualizada.
   */
  eliminarProfesor(professorName: string) {
    const url = this.apiUrl + `professor_to_delete/${professorName}`;
    return this.http.delete(url);
  }

  /**
   * Función para eliminar objetos de un entrenador.
   *
   * @param objetosAEliminar Lista de objetos que se desean eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteObjectsFromTrainer(objetosAEliminar: any[]): Observable<any> {
    const url = `${this.apiUrl}eliminar-objetos`;

    // Utiliza DELETE para eliminar recursos
    return this.http
      .request<any>('DELETE', url, {
        body: { objetos: objetosAEliminar },
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error al eliminar objetos:', error);
          return throwError(
            'Error al eliminar objetos. Por favor, inténtalo de nuevo más tarde.'
          );
        })
      );
  }

  assignCreatureToTrainer(trainerName: string, creature: any): Observable<any> {
    const url = this.apiUrl + 'assign-creature';
    const body = { trainerName, creature };

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
   * Función para asignar un mismo Grumpi a varios entrenadores al mismo tiempo.
   *
   * @param trainerNames Lista de entrenadores seleccionados.
   * @param creature Grumpi que se ha seleccionado.
   * @returns
   */
  assignCreatureToTrainers(
    trainerNames: string[],
    creature: string
  ): Observable<any> {
    const url = this.apiUrl + 'assign-creature';
    const body = { trainerNames, creature };

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
   * Función para asignar una sola medalla a varios entrenadores al mismo timepo.
   *
   * @param trainerNames
   * @param medal
   * @returns
   */
  assignMedalToTrainers(
    trainerNames: string[],
    medal: string
  ): Observable<any> {
    const url = this.apiUrl + 'assign-medal';
    const body = { trainerNames, medal };

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
   * Función para asignar un distintivo de liga a varios entrenadores al mismo tiempo.
   *
   * @param trainerNames --> Listado de entrenadores seleccionados.
   * @param badge --> Distintivo de liga seleccionado
   * @returns
   */
  assignBadgeToTrainers(
    trainerNames: string[],
    badge: string
  ): Observable<any> {
    const url = this.apiUrl + 'assign-badge';
    const body = { trainerNames, badge };

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
   * Función para asignar una energía a un entrenador
   *
   * @param trainerName Recibe el nombre del entrenador
   * @param energieName Recibe el nombre de la energía
   * @returns
   */
  assignEnergie(trainerName: string, energie: any): Observable<any> {
    const url = this.apiUrl + 'assign-energie';
    const body = { trainerName, energie };

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
   *
   * @param trainerNames
   * @param energie
   * @returns
   */
  assignEnergieToTrainers(trainerNames: string[], energie: any) {
    const url = `${this.apiUrl}assign-energie`;
    return this.http.post<any>(url, { trainerNames, energie });
  }

  /**
   * Función para asignar la medalla a un entrenador.
   *
   * @param trainerName
   * @param medalName
   * @returns
   */
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

  /**
   * Función para asignar el objeto de combate a un entrenador.
   *
   * @param trainerName
   * @param combatObject
   * @returns
   */
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

  /**
   * Función para asignar el objeto de evolución al entrenador.
   * @param trainerName
   * @param evoObject
   * @returns
   */
  assignEvolutionObjectsToTrainer(
    trainerName: string,
    evoObject: string
  ): Observable<any> {
    const url = `${this.apiUrl}assign-evo-objects`;
    const body = { trainerName, evoObject };

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

  /************************************************
   *
   *
   *             GESTIÓN DE PROFESORADO
   *
   *
   ***********************************************/

  /**
   * Función para obtener una lista de profesores
   *
   * @returns Devuelve una lista de profesores disponibles
   */
  getProfesores(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}profesores`);
  }

  /**
   * Función para obtener un profesor por su id
   * @param id
   * @returns
   */
  getProfesor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}profesor/${id}`);
  }

  /**
   * Función para obtener un profesor por su nombre
   * @param nombre
   * @returns
   */
  getProfesorByName(nombre: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}profesor/${nombre}`);
  }

  getEntrenadoresByProfesorId(profesorId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}profesor/${profesorId}/entrenadores`
    );
  }

  // Añade este método para usar las energías seleccionadas
  useEnergiesForReward(name: string, energies: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}use-energies`, {
      name,
      energies,
    });
  }

  spendEnergies(
    trainerName: string,
    energiesToSpend: { type: string; quantity: number }[]
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}spend-energies`, {
      trainerName,
      energiesToSpend,
    });
  }

  assignReward(trainerName: string, reward: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}assign-rewards`, {
      trainerName,
      reward,
    });
  }

  saveNewOrder(trainers: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}trainers/order`, { trainers });
  }
}
