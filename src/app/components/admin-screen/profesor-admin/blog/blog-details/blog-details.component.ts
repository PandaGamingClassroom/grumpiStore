import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TrainerService } from '../../../../services/trainers/trainer.service';


@Component({
  selector: 'app-blog-details',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  providers: [TrainerService],
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit {

  profesor: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BlogDetailsComponent>
  ) {

  }

  ngOnInit(): void {
    this.profesor = localStorage.getItem('id_profesor');
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }


  close() {
    this.dialogRef.close();
  }
}
