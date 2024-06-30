import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-image',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './view-image.component.html',
  styleUrl: './view-image.component.scss',
})
export class ViewImageComponent implements OnInit {
  isGrumpi: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isAGrumpi(this.data);
  }

  isAGrumpi(data: any) {
    console.log('Data que se recibe: ', data);
    if (data.hasOwnProperty('n_grumpidex')) {
      this.isGrumpi = true;
    } else {
      this.isGrumpi = false;
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
