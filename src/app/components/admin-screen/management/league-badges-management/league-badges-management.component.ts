import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { NavBarAdminComponent } from '../../navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { GrumpiService } from '../../../services/grumpi/grumpi.service';
import { TrainerService } from '../../../services/trainers/trainer.service';

@Component({
  selector: 'app-league-badges-management',
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
  templateUrl: './league-badges-management.component.html',
  styleUrl: './league-badges-management.component.scss',
})
export class LeagueBadgesManagementComponent implements OnInit {
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
