import { CommonModule } from '@angular/common';
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
    FormsModule,
    MatDialogModule,
  ],
  templateUrl: './view-image.component.html',
  styleUrl: './view-image.component.scss',
})
export class ViewImageComponent implements OnInit {
  isGrumpi: boolean = false;
  isFire: boolean = false;
  isWater: boolean = false;
  isLight: boolean = false;
  isDark: boolean = false;
  isThunder: boolean = false;
  isNormal: boolean = false;
  isEarth: boolean = false;
  isLife: boolean = false;

  isNotAMedal: boolean = false;
  imageUrl: string = '';

  constructor(
    public dialogRef: MatDialogRef<ViewImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.isAGrumpi(this.data);
    this.detectedMedalName(this.data);
    console.log('Data que se recibe: ', this.data);
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  detectedMedalName(data: any) {
    if (this.checkIsMedal(data)) {
      this.isNotAMedal = false;
      if (data.toLowerCase().includes('fuego')) {
        this.isFire = true;
      } else if (data.toLowerCase().includes('agua')) {
        this.isWater = true;
      } else if (data.toLowerCase().includes('luz')) {
        this.isLight = true;
      } else if (data.toLowerCase().includes('oscuridad')) {
        this.isDark = true;
      } else if (data.toLowerCase().includes('rayo')) {
        this.isThunder = true;
      } else if (data.toLowerCase().includes('normal')) {
        this.isNormal = true;
      } else if (data.toLowerCase().includes('tierra')) {
        this.isEarth = true;
      } else if (data.toLowerCase().includes('vida')) {
        this.isLife = true;
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
