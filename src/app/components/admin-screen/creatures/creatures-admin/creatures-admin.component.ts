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
import { HttpClientModule } from '@angular/common/http';
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

  constructor(
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder
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
    console.log('Grumpis:', this.grumpis);
  }

  onSubmit() {
    const datosGrumpi = this.myForm.value;

    // Obtener el archivo del input de tipo file
    const controlImagen = this.myForm.get('imagen');
    const archivoImagen = controlImagen ? controlImagen.value : null;

    console.log('Grumpi: ', datosGrumpi);

    this.grumpiService.subirGrumpi(datosGrumpi).subscribe(
      (respuesta) => {
        console.log('Grumpi enviado correctamente', respuesta);
        // Aquí puedes realizar cualquier acción adicional después de enviar los datos
      },
      (error) => {
        console.error('Error al enviar el grumpi', error);
        // Aquí puedes manejar el error de acuerdo a tus necesidades
      }
    );
  }
}
