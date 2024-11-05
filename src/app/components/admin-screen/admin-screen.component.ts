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
import { SwPush } from '@angular/service-worker';
import { HttpClient } from '@angular/common/http';

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
  ],
  providers: [TrainerService, AdminUserService],
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss'],
})
export class AdminScreenComponent implements OnInit {
  readonly VAPID_PUBLIC_KEY =
    'BFD_VPxiPRpJzte77znqB9zm3v6acV1fQUSyFo-jdOQNi_GKhxVgaKJfvCFSrAdX9XTa-5NrBbYhSbIKkeyPRPs';
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
  isLoading = false;

  constructor(
    private trainersService: TrainerService,
    private adminUserService: AdminUserService,
    private router: Router,
    private notificationService: NotificationService,
    private swPush: SwPush,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.initializeUserData();
    this.loadNotifications();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  clearNotifications() {
    this.notificationService.clearNotifications();
    this.loadNotifications();
  }

  triggerNotification() {
    this.notificationService.addNotification('Nueva actualización disponible');
    this.loadNotifications();
  }

  loadNotifications() {
    if (this.profesor && this.profesor.data && this.profesor.data.id) {
      this.notificationService
        .getNotificationsFromServer(this.profesor.data.id)
        .subscribe(
          (data) => {
            console.log('NOTIFICACIONES DEL PROFESOR: ', data);
            this.notifications = data;
            this.notificationCount = this.notifications.length;
          },
          (error) => {
            console.error('Error al cargar notificaciones:', error);
          }
        );
    } else {
      console.warn('Datos del profesor no disponibles aún.');
    }
  }

  requestNotificationPermission() {
    this.swPush
      .requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
      .then((subscription) => {
        console.log('Suscripción creada:', subscription);
        this.saveSubscription(subscription);
      })
      .catch((err) =>
        console.error('No se pudo suscribir a las notificaciones', err)
      );
  }

  saveSubscription(subscription: PushSubscription) {
    const professorId = this.profesor?.data.id;
    console.log('Professor ID:', this.profesor);
    const url = 'https://grumpistoreserver.onrender.com/save-subscription';

    this.http
      .post(
        url,
        { subscription, professor_id: professorId },
        { responseType: 'text' }
      )
      .subscribe({
        next: (response) => {
          console.log('Suscripción guardada con éxito:', response);
        },
        error: (err) => {
          console.error('Error al guardar la suscripción', err);
        },
      });
  }

  // Alterna el estado de la barra lateral
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Inicializa datos del usuario desde localStorage
  initializeUserData() {
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

  // Obtiene los datos del profesor y los entrenadores asociados
  fetchProfessorData(name: string) {
    this.isLoading = true;
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data;
          this.lastNameProfesor = data.data.apellidos;
          this.isAdminUser = data.data.rol === 'administrador';
          this.adminUserService.setAdminUser(this.isAdminUser);
          this.isLoading = false;
          console.log('Datos del profesor que inicia sesión: ', this.profesor);

          this.getTrainers(data.data.id);

          this.requestNotificationPermission();
          this.loadNotifications();
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Error:', error);
      }
    );
  }

  // Obtiene la lista de entrenadores asignados al profesor
  getTrainers(profesorId: number) {
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
