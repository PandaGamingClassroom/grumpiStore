import { Component, OnInit } from '@angular/core';
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
import { NotificationService } from '../../components/services/notification.service';

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
  styleUrls: ['./admin-screen.component.scss'],
})
export class AdminScreenComponent implements OnInit {
  userData: any;
  username: string | null = null;
  modalAbierta = false;
  confirmMessage: string = 'Grumpi añadido correctamente.';
  profesor: any;
  trainers: any[] = [];
  nameProfesor: string | null = null;
  lastNameProfesor: string | null = null;
  adminUser: string | null = null;
  activeSection: string | null = null;
  showLogo: boolean = true;
  isAdminUser: boolean = false;
  isSidebarCollapsed = true;

  notifications: string[] = [];
  showNotifications = false;
  notificationCount = 0;

  currentTime: string = '';

  constructor(
    private trainersService: TrainerService,
    private adminUserService: AdminUserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.initializeUserData();
    this.notifications = this.notificationService.getNotifications();
    this.notificationCount = this.notifications.length;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
    this.notifications = [];
    this.notificationCount = 0;
  }

  // Método para simular una notificación (puedes reemplazarlo con eventos reales)
  triggerNotification() {
    this.notificationService.addNotification('Nueva actualización disponible');
    this.notificationCount++;
  }

  // Inicializa datos del usuario desde localStorage
  private initializeUserData() {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.nameProfesor = localStorage.getItem('nameUser');
      this.lastNameProfesor = localStorage.getItem('lastNameUser');
      this.adminUser = localStorage.getItem('isAdminUser');
      this.isAdminUser = this.adminUser === 'administrador';

      if (this.nameProfesor) {
        this.fetchProfessorData(this.nameProfesor);
      }
    }
  }

  // Alterna el estado de la barra lateral
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Obtiene los datos del profesor y los entrenadores asociados
  private fetchProfessorData(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data;
          this.lastNameProfesor = data.data.apellidos;
          this.isAdminUser = data.data.rol === 'administrador';
          this.adminUserService.setAdminUser(this.isAdminUser);

          console.log('Datos del profesor que inicia sesión: ', this.profesor);

          // Obtiene la lista de entrenadores asociados al profesor
          this.getTrainers(data.data.id);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // Obtiene la lista de entrenadores asignados al profesor
  private getTrainers(profesorId: number) {
    this.trainersService.getEntrenadoresByProfesorId(profesorId).subscribe(
      (data) => {
        this.trainers = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  // Deshabilita el clic derecho
  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  // Muestra la sección activa y colapsa la barra lateral
  showSection(section: string) {
    console.log('Navigating to section:', section);
    this.showLogo = section === null;
    this.activeSection = section;
    this.toggleSidebar();
  }

  // Navega a la pantalla de reglas de administrador
  navigateToRules() {
    this.router.navigate(['/rules_admin']);
  }

  // Cierra la sesión del usuario
  logOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
