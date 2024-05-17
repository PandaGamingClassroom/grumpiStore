import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { RouterLink } from '@angular/router';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { url_upload_medals } from '../../../../models/urls';
import { ConfirmModalComponentComponent } from '../../../../segments/confirm-modal-component/confirm-modal-component.component';

@Component({
  selector: 'app-medals-admin-screen',
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
  templateUrl: './medals-admin-screen.component.html',
  styleUrl: './medals-admin-screen.component.scss',
})
export class MedalsAdminScreenComponent implements OnInit {
  myForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  imageUrls: string[] = [];
  uploadUrl: string = url_upload_medals;
  modalAbierta = false;
  confirmMessage: string = 'Medalla añadida correctamente.';

  constructor(
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      imagen: [''],
    });
  }

  /**
   * Función para verificar que la imagen se ha seleccionado.
   * @param event Recibe la información de la imagen seleccionada en el input
   */
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

  openModal() {
    if (!this.modalAbierta) {
      const data = {
        title: '¡Medalla guardada correctamente!',
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
