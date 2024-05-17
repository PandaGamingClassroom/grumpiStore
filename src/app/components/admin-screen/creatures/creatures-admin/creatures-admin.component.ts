import { Component, OnInit } from '@angular/core';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { MatDialogModule } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CartaGrumpi, cartas_grumpi } from '../../../../models/grumpi';

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
  providers: [GrumpiService],
  templateUrl: './creatures-admin.component.html',
  styleUrl: './creatures-admin.component.scss',
})
export class CreaturesAdminComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  nombre!: string;
  descripcion!: string;
  numeroGrumpidex!: number;
  listaAtaques!: string;
  energia!: number;
  salud!: number;
  grumpis: CartaGrumpi[] = cartas_grumpi;
  selectedFile: File | null = null;
  imageUrls: string[] = [];

  constructor(
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      numeroGrumpidex: ['', Validators.required],
      listaAtaques: ['', Validators.required],
      energia: ['', Validators.required],
      salud: ['', Validators.required],
      imagen: [''],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = null;
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

    this.http.post('http://localhost:3000/upload', formData).subscribe(
      (response) => {
        console.log('Imagen subida correctamente', response);
      },
      (error: HttpErrorResponse) => {
        console.error('Error al enviar el grumpi', error);
      }
    );
  }

  // Método para cargar la URL de la imagen desde el servidor
  loadImageUrls() {
    this.grumpiService.getImageUrls().subscribe(
      (response) => {
        this.imageUrls = response.imageUrls;
        console.log('URL: ', this.imageUrls);

      },
      (error) => {
        console.error('Error al obtener las URLs de las imágenes:', error);
      }
    );
  }
}
