import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-login-modal-component',
  standalone: true,
  imports: [],
  templateUrl: './error-login-modal-component.component.html',
  styleUrl: './error-login-modal-component.component.scss',
})
export class ErrorLoginModalComponentComponent {

  constructor(
    public dialogRef: MatDialogRef<ErrorLoginModalComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
    window.location.reload();
  }
}
