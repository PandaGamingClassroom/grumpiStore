import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-bienvenida-modal',
  standalone: true,
  imports: [],
  templateUrl: './bienvenida-modal.component.html',
  styleUrl: './bienvenida-modal.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        // Al entrar en la vista
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        // Al salir de la vista
        animate('500ms ease-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class BienvenidaModalComponent implements OnInit {
  username: any;
  avatar = localStorage.getItem('selectedAvatar');

  constructor(
    public dialogRef: MatDialogRef<BienvenidaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
    }
  }
  closeDialog() {
    this.dialogRef.close();
  }
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
