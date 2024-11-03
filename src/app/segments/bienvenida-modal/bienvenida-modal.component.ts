import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, style, animate, transition } from '@angular/animations';
import { TrainerService } from '../../components/services/trainers/trainer.service';


@Component({
  selector: 'app-bienvenida-modal',
  standalone: true,
  imports: [],
  providers: [TrainerService],
  templateUrl: './bienvenida-modal.component.html',
  styleUrl: './bienvenida-modal.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' }),
        animate(
          '800ms cubic-bezier(0.25, 0.8, 0.25, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms ease-in-out',
          style({ opacity: 0, transform: 'scale(0.9) translateY(20px)' })
        ),
      ]),
    ]),
  ],
})
export class BienvenidaModalComponent implements OnInit {
  username: any;
  avatar: string = '';
  trainer: any;

  constructor(
    public dialogRef: MatDialogRef<BienvenidaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private trainersService: TrainerService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
        this.getTrainerData(this.username);
    }
  }

  /**
   * Obtiene los datos del entrenador que ha iniciado sesión
   * @param name
   */
  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.trainer = data;
          this.avatar = data.avatar;
          console.log('Datos del entrenador: ', this.trainer);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
