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
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { CartaGrumpi, cartas_grumpi } from '../../../models/grumpi';
import { url_upload_grumpis } from '../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../segments/confirm-modal-component/confirm-modal-component.component';
import { TrainerService } from '../../services/trainers/trainer.service';
import { AttackType, typeOfAttacks } from '../../../models/attacks';
import { SelectTrainerComponent } from '../trainers/select-trainer/select-trainer.component';
import { ErrorLoginModalComponentComponent } from '../../../segments/error-login-modal-component/error-login-modal-component.component';

@Component({
  selector: 'app-creatures-admin',
  standalone: true,
  imports: [
    RouterLink,
    NavBarAdminComponent,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  providers: [GrumpiService, TrainerService],
  templateUrl: './creatures-admin.component.html',
  styleUrl: './creatures-admin.component.scss',
})
export class CreaturesAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  grumpis: CartaGrumpi[] = cartas_grumpi;
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
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      console.error('No file selected');
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
      img: '', // La URL de la imagen se actualizará después de subirla
      descripcion: formValues.descripcion,
      ataques: [firstAttack, specialAttack],
      tipo: formValues.tipo,
    };

    // Enviar la imagen al servidor
    this.http.post<any>(this.uploadUrl, formData).subscribe(
      (response) => {
        console.log('Imagen subida correctamente', response);

        // Actualizar la URL de la imagen en el objeto Grumpi
        this.grumpiData.img = response.imageUrl; // Ajusta esto según la respuesta real del servidor

        // Enviar los datos del Grumpi al servicio de Angular
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
        // Aquí podrías mostrar un modal de confirmación o realizar alguna otra acción
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
    if (!this.modalAbierta) {
      const data = {
        title: '¡Grumpi guardado correctamente!',
        message: this.confirmMessage,
      };
      const dialogRef = this.dialog.open(ConfirmModalComponentComponent, {
        width: '400px',
        height: '300px',
        data: data,
      });
      dialogRef.afterClosed().subscribe(() => window.location.reload());
      this.modalAbierta = true;
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
      dialogRef.afterClosed().subscribe();
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
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((selectedTrainerName: string | null) => {
      if (selectedTrainerName) {
        this.selectedTrainerName = selectedTrainerName;
        console.log('Seleccion de entrenador: ', selectedTrainerName);
        this.assignCreature();
      }
    });
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
