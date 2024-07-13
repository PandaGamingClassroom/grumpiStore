import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
  isFire: boolean = false;
  isNotAMedal: boolean = false;
  imageUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isAGrumpi(this.data);
    this.detectedMedalName(this.data);
    this.checkIsMedal(this.data);
    if (!this.isGrumpi && !this.data?.imagen) {
      this.imageUrl = this.data;
    } else if (this.data?.img) {
      this.imageUrl = this.data.img;
    } else if (this.data?.imagen) {
      this.imageUrl = this.data.imagen;
    }
    console.log('Data que se recibe: ', this.data);
    console.log('Image URL: ', this.imageUrl);
  }

  detectedMedalName(data: any) {
    if (this.checkIsMedal(data)) {
      this.isNotAMedal = false;
      if (data.includes('fuego')) {
        this.isFire = true;
      }
    } else {
      this.isNotAMedal = true;
    }
  }

  isAGrumpi(data: any) {
    if (data.hasOwnProperty('n_grumpidex')) {
      this.isGrumpi = true;
    } else {
      this.isGrumpi = false;
    }
  }

  checkIsMedal(data: any): boolean {
    return (
      typeof data === 'string' &&
      !data.hasOwnProperty('id') &&
      !data.hasOwnProperty('nombre') &&
      !data.hasOwnProperty('tipo') &&
      !data.hasOwnProperty('descripcion')
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
