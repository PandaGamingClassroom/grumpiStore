import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal-component',
  standalone: true,
  imports: [],
  templateUrl: './confirm-modal-component.component.html',
  styleUrl: './confirm-modal-component.component.scss',
})
export class ConfirmModalComponentComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Cerrar el modal y devolver true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cerrar el modal y devolver false
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
