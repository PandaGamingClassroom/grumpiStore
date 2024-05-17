import { Component, OnInit } from '@angular/core';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
import { url_upload_grumpis } from '../../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

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
  grumpis: CartaGrumpi[] = cartas_grumpi;
  selectedFile: File | null = null;
  imageUrls: string[] = [];
  uploadUrl: string = url_upload_grumpis;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';

  constructor(
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.myForm = this.formBuilder.group({
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
      dialogRef.afterClosed().subscribe((result) => {
        window.location.reload();
      });
      this.modalAbierta = true;
    }
  }
}
