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
      descripcion: ['', Validators.required],
      firstAttack: ['', Validators.required],
      specialAttack: ['', Validators.required],
    });
    if (typeof window !== 'undefined') {
      this.adminUser = localStorage.getItem('isAdminUser');
      this.isAdminUser = this.adminUser === 'administrador';
    }
    this.getTrainers();
    this.loadAttacks();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file ? file : null;
    if (this.searchTerm) {
      this.isTypeSelected = true;
    } else {
      this.isTypeSelected = false;
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

    this.http.post(this.uploadUrl, formData).subscribe(
      (response) => {
        console.log('Imagen subida correctamente', response);
        this.openModal();
      },
      (error: HttpErrorResponse) => {
        console.error('Error al enviar el grumpi', error);
      }
    );
  }

  loadImageUrls() {
    this.grumpiService.getImageUrls().subscribe(
      (response) => {
        this.imageUrls = response.imageUrls;
      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }

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
