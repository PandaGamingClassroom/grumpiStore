import { Component, OnInit } from '@angular/core';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { url_upload_grumpis } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { TrainerService } from '../../services/trainers/trainer.service';
import { AttackType, typeOfAttacks } from '../../../models/attacks';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { ErrorLoginModalComponentComponent } from '../../../segments/error-login-modal-component/error-login-modal-component.component';
import { FooterComponent } from '../../footer/footer.component';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { MessageModalComponent } from '../../../segments/message-modal-component/message-modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-creatures-admin',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FooterComponent,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './creatures-admin.component.html',
  styleUrl: './creatures-admin.component.scss',
})
export class CreaturesAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  imageUrls: string[] = [];
  trainerList: any[] = [];
  uploadUrl: string = url_upload_grumpis;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';
  searchTerm: string = '';
  searchAttack: string = '';
  selectedTrainerName: string | null = null;
  selectedCreatureName: string | null = null;
  trainers: any[] = [];
  grumpiList: any[] = [];
  isAdminUser: boolean = false;
  adminUser: any;
  typesAttacks: AttackType[] = typeOfAttacks;
  attacks_list: any[] = [];
  selectedListAttack: any[] = [];
  isTypeSelected: boolean = false;
  grumpiData: any;
  exist: boolean = false;
  seeAllGrumpis: boolean = false;

  constructor(
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private trainersService: TrainerService
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      imagen: ['', Validators.required],
      nombre: ['', Validators.required],
      numero: ['', Validators.required],
      tipo: ['', Validators.required],
      descripcion: [''],
      firstAttack: ['', Validators.required],
      specialAttack: ['', Validators.required],
    });
    if (typeof window !== 'undefined') {
      this.adminUser = localStorage.getItem('isAdminUser');
      this.isAdminUser = this.adminUser === 'administrador';
    }
    this.loadGrumpis();
    this.getTrainers();
    this.loadAttacks();
  }

  onFileSelected(event: any) {
    const selectedType = event.target.value;
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }

    if (selectedType) {
      this.isTypeSelected = true;
    }
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      console.error('No hya imagen seleccionada');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);

    // Obtener los valores del formulario
    const formValues = this.myForm.value;
    this.findNumberGrumpidex(formValues.numero);
    if (this.findNumberGrumpidex(formValues.numero)) {
      this.openErrorModal();
    }

    const firstAttack = this.attacks_list.find(
      (atq) => atq.nombre === formValues.firstAttack
    );
    const specialAttack = this.attacks_list.find(
      (atq) => atq.nombre === formValues.specialAttack
    );

    if (!firstAttack || !specialAttack) {
      console.error('Invalid attack selected');
      return;
    }

    // Construir el objeto Grumpi a enviar
    this.grumpiData = {
      nombre: formValues.nombre,
      n_grumpidex: formValues.numero,
      img: '',
      descripcion: formValues.descripcion,
      ataques: [firstAttack, specialAttack],
      tipo: formValues.tipo,
    };

    // Enviar la imagen al servidor
    this.http.post<any>(this.uploadUrl, formData).subscribe(
      (response) => {
        console.log('Imagen subida correctamente', response);
        this.grumpiData.img = response.imageUrl;
        this.saveGrumpi();
      },
      (error: HttpErrorResponse) => {
        console.error('Error al enviar la imagen', error);
      }
    );
  }

  saveGrumpi() {
    this.grumpiService.saveGrumpi(this.grumpiData).subscribe(
      (response) => {
        console.log('Grumpi guardado correctamente en Node.js:', response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error al guardar el Grumpi en Node.js', error);
      }
    );
  }

  /**
   *
   * Comprueba si el número introducido para la Grumpidex ya existe
   *
   */
  findNumberGrumpidex(numberOnInput: string) {
    console.log(numberOnInput);

    for (let grumpi of this.grumpiList) {
      if (grumpi.n_grumpidex == numberOnInput) {
        this.exist = true;
      } else {
        this.exist = false;
      }
    }

    return this.exist;
  }

  /**
   *
   * Se obtienen los datos de los Grumpi disponibles.
   *
   */
  loadGrumpis() {
    this.grumpiService.getGrumpis().subscribe(
      (response) => {
        this.grumpiList = response.grumpis_list;
        console.log('Grumpis: ', this.grumpiList);
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

  /**
   * Función para mostrar u ocultar la lista
   * de Grumpis disponibles.
   */
  verGrumpis() {
    if (!this.seeAllGrumpis) {
      this.seeAllGrumpis = true;
    } else {
      this.seeAllGrumpis = false;
    }
  }

  /**
   *
   * Abre la ventana modal en la que se muestra
   * un mensaje de confirmación.
   *
   */
  openModal() {
    const data = {
      title: '¡Grumpi guardado correctamente!',
      message: this.confirmMessage,
    };

    const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
      width: '400px',
      height: '300px',
      panelClass: 'custom-modal',
      disableClose: true,
      autoFocus: true,
      data: data,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.modalAbierta = false;
    });

    this.modalAbierta = true;
  }

  /**
   *
   * Se abre una ventana modal para mostrar al profesor
   * un mensaje de ayuda sobre el ataque que se va a seleccionar.
   *
   */
  openHelpMessage(ataque: string) {
    if (ataque === 'ataquePrincipal') {
      const data = {
        title: '¡Información!',
        subTitle: 'Ataque Principal',
        message:
          'Se trata del ataque básico que va a aparecer asignado al nuevo Grumpi.',
      };
      const dialogRef = this.dialog.open(MessageModalComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe();
    } else if (ataque === 'special') {
      const data = {
        title: '¡Información!',
        subTitle: 'Ataque Especial',
        message:
          'Se trata del ataque que necesita de una energía, dependiendo del tipo que sea el ataque, para poder ser utilizado.' +
          'Por eso, recuerda seleccionar primero el Tipo del ataque.',
      };
      const dialogRef = this.dialog.open(MessageModalComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe();
    }
  }

  /**
   *
   * Se abre una ventana modal en la que
   * se muestra un mensaje de error al usuario
   *
   */
  openErrorModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Algo ha salido mal!',
        message: 'El número de la Grumpidex, ya existe.',
      };
      const dialogRef = this.dialog.open(ErrorLoginModalComponentComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe(() => {
        this.modalAbierta = false;
      });
      this.modalAbierta = true;
    }
  }

  get filteredCreaturesImages(): any[] {
    return this.grumpiList.filter((imageUrl) =>
      imageUrl.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get filteredListAttacks(): any[] {
    return this.attacks_list.filter(
      (atk) => atk.tipo === this.myForm.get('tipo')?.value
    );
  }

  /**
   *
   * Se obtienen los datos de los entreandores.
   *
   */
  getTrainers() {
    this.trainersService.getTrainers().subscribe(
      (response: any) => {
        if (Array.isArray(response.trainer_list)) {
          this.trainerList = response.trainer_list;
        } else {
          console.error(
            'Error: los datos de entrenadores no son un array:',
            response.trainer_list
          );
        }
      },
      (error) => {
        console.error('Error obteniendo los entrenadores:', error);
      }
    );
  }

  /**
   *
   * Se asigna el Grumpi al entrenador.
   *
   */
  assignCreature() {
    if (this.selectedTrainerName && this.selectedCreatureName) {
      const trainerName = this.selectedTrainerName;
      const creature = this.selectedCreatureName;

      this.trainersService
        .assignCreatureToTrainer(trainerName, creature)
        .subscribe(
          (response) => {
            console.log('Criatura asignada con éxito:', response);
            alert('Criatura asignada con éxito');
          },
          (error) => {
            console.error('Error asignando la criatura:', error);
            alert('Error asignando la criatura');
          }
        );
    } else {
      alert('Por favor, selecciona un entrenador y una criatura.');
    }
  }

  /**
   *
   * Se abre una ventana modal en la que se pude hacer una selección
   * de los entrenadores disponibles.
   *
   */
  openTrainers() {
    const dialogRef = this.dialog.open(SelectTrainerComponent, {
      width: '400px',
      height: '360px',
      data: this.selectedCreatureName,
    });

    dialogRef
      .afterClosed()
      .subscribe((selectedTrainerNames: number[] | null) => {
        if (selectedTrainerNames && selectedTrainerNames.length > 0) {
          this.selectedTrainerName = selectedTrainerNames.join(', ');
          this.assignCreaturesToTrainers(selectedTrainerNames);
        }
      });
  }

  /**
   * Función para poder asignar el mismo Grumpi a varios entrenadores al mismo tiempo.
   *
   * @param trainerNames Lista de entrenadores seleciconados.
   */
  assignCreaturesToTrainers(trainerIds: number[]) {
    if (trainerIds.length > 0 && this.selectedCreatureName) {
      const creature = this.selectedCreatureName.trim(); // Eliminar espacios en blanco
      const validTrainerIds: number[] = [];
      let checkedTrainersCount = 0; // Contador para saber cuándo hemos verificado todos los entrenadores
      let alreadyHasCreature = false; // Variable para detectar si algún entrenador ya tiene la criatura

      console.log('Grumpi seleccionado:', creature); // Verificación del grumpi seleccionado

      trainerIds.forEach((trainerId) => {
        this.trainersService.getTrainerById(trainerId).subscribe(
          (trainer) => {
            const trainerGrumpis = trainer.data.grumpis || []; // Inicializamos como un array vacío si es undefined
            console.log('Lista de grumpis del entrenador: ', trainerGrumpis);

            // Mostrar nombres de los grumpis en la lista para depuración
            trainerGrumpis.forEach((grumpi: any) => {
              console.log('Nombre en la lista:', grumpi.nombre);
            });

            // Verificar si el entrenador ya tiene el Grumpi
            const hasCreature = trainerGrumpis.some(
              (grumpi: any) =>
                grumpi.nombre.trim().toLowerCase() === creature.toLowerCase() // Compara ignorando mayúsculas
            );
            console.log(
              `El entrenador ${trainer.data.name} tiene la criatura:`,
              hasCreature
            );

            // Si el entrenador ya tiene la criatura, establecer el flag
            if (hasCreature) {
              alreadyHasCreature = true;
            } else {
              // Si no la tiene, agregarlo a la lista de entrenadores válidos
              validTrainerIds.push(trainerId);
            }

            // Incrementar el contador de entrenadores verificados
            checkedTrainersCount++;

            // Verificar si todos los entrenadores han sido procesados
            if (checkedTrainersCount === trainerIds.length) {
              // Si algún entrenador ya tiene la criatura, mostrar un mensaje de error y detener el proceso
              if (alreadyHasCreature) {
                alert(
                  'Uno o más entrenadores ya tienen esta criatura. No se puede asignar de nuevo.'
                );
                return;
              }

              // Asignar la criatura solo a los entrenadores que no la tengan
              if (validTrainerIds.length > 0) {
                this.trainersService
                  .assignCreatureToTrainers(validTrainerIds, creature)
                  .subscribe(
                    (response) => {
                      console.log('Criatura asignada con éxito:', response);
                      this.openModal();
                    },
                    (error) => {
                      console.error('Error asignando la criatura:', error);
                      alert('Error asignando la criatura');
                    }
                  );
              }
            }
          },
          (error) => {
            console.error('Error obteniendo el entrenador:', error);
            alert('Error al verificar los entrenadores.');
          }
        );
      });
    } else {
      alert('Por favor, selecciona al menos un entrenador y una criatura.');
    }
  }

  /**
   *
   * Se obtiene el listado de ataques disponibles
   * para poder mostrarlos al usuario.
   *
   */
  loadAttacks() {
    this.grumpiService.getAllAttacks().subscribe(
      (response: any) => {
        this.attacks_list = response.attacks_list;
      },
      (error) => {
        console.error('Error obtaining attacks:', error);
      }
    );
  }
}
