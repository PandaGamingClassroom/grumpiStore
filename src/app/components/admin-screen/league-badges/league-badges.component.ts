import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../services/trainers/trainer.service';
import { GrumpiService } from '../../services/grumpi/grumpi.service';
import { NavBarAdminComponent } from '../navBar-admin/nav-bar-admin/nav-bar-admin.component';

@Component({
  selector: 'app-league-badges',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    NavBarAdminComponent,
  ],
  providers: [TrainerService, GrumpiService],
  templateUrl: './league-badges.component.html',
  styleUrl: './league-badges.component.scss',
})
export class LeagueBadgesComponent implements OnInit {


  myForm: FormGroup = new FormGroup({});

  constructor(
    private trainersService: TrainerService,
    private grumpiService: GrumpiService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      imagen: [''],
    });
  }
}
