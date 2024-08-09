import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-bienvenida-modal',
  standalone: true,
  imports: [],
  templateUrl: './bienvenida-modal.component.html',
  styleUrl: './bienvenida-modal.component.scss',
})
export class BienvenidaModalComponent implements OnInit{

  username: any;

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
}
