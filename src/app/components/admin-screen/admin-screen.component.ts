import {
  Component,
  OnInit
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { GrumpidolarsComponent } from './grumpidolars/grumpidolars.component';
import { EnergiesComponent } from './energies/energies.component';
import { TrainerService } from '../services/trainers/trainer.service';
import { CommonModule } from '@angular/common';
import { TrainersAdminComponent } from './trainers/trainers-admin/trainers-admin.component';
import { MedalsAdminScreenComponent } from './medals/medals-admin-screen.component';
import { LeagueBadgesComponent } from './league-badges/league-badges.component';
import { CreaturesAdminComponent } from './creatures/creatures-admin.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AdminUserService } from '../services/adminUser/adminUser.service';
import { NavBarAdminComponent } from './navBar-admin/nav-bar-admin/nav-bar-admin.component';
import { ProfesorAdmin } from './profesor-admin/profesor-admin.component';
import { ProfileComponent } from './profesor-admin/profile/profile-profesor.component';
import { BlogScreenComponent } from './profesor-admin/blog/blog-screen.component';
import { RulesAdminComponent } from './rules-admin/rules-admin.component';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavBarAdminComponent,
    FooterComponent,
    TrainersAdminComponent,
    ProfesorAdmin,
    ProfileComponent,
    MedalsAdminScreenComponent,
    LeagueBadgesComponent,
    GrumpidolarsComponent,
    EnergiesComponent,
    CreaturesAdminComponent,
    BlogScreenComponent,
    RulesAdminComponent,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FooterComponent,
  ],
  providers: [TrainerService, AdminUserService],
  templateUrl: './admin-screen.component.html',
  styleUrl: './admin-screen.component.scss',
})
export class AdminScreenComponent implements OnInit {
  userData: any;
  username: any;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';
  profesor: any;
  trainers: any[] = [];
  nameProfesor: any;
  lastNameProfesor: any;
  adminUser: any;
  activeSection: string | null = null;
  showLogo: boolean = true;
  isAdminUser: boolean = false;

  isSidebarCollapsed = true;

  currentTime: string = '';

  constructor(
    private trainersService: TrainerService,
    private adminUserService: AdminUserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener los datos de la ruta
    if (typeof window !== 'undefined') {
      // Verifica si `window` está definido
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.lastNameProfesor = localStorage.getItem('lastNameUser');
      this.adminUser = localStorage.getItem('isAdminUser');
      this.isAdminUser = this.adminUser === 'administrador';
      this.getDadataProfesor(this.nameProfesor);
    }

  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data;
          this.lastNameProfesor = data.data.apellidos;
          if (this.profesor.data.rol === 'administrador') {
            this.adminUserService.setAdminUser(true);
          } else {
            this.adminUserService.setAdminUser(false);
          }
          console.log('Datos del profesor que inicia sesión: ', this.profesor);
          this.getEntrenadores(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  getEntrenadores(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  showSection(section: string) {
    console.log('Navigating to section:', section);
    if (section) {
      this.showLogo = false;
    }
    this.activeSection = section;
    this.toggleSidebar();
    console.log('Active section set to:', this.activeSection);
    if (this.activeSection === 'guide') {
      this.navigateToRules();
    }
  }

  navigateToRules() {
    this.router.navigate(['/rules_admin']);
  }

  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
