import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NavBarComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  avatar_list: any[] = [];
  avatar0 = '../../../assets/avatars/Avatar-1.png';
  avatar1 = '../../../assets/avatars/Avatar-2.png';
  avatar2 = '../../../assets/avatars/Avatar-3.png';
  avatar3 = '../../../assets/avatars/Avatar-4.png';
  avatar4 = '../../../assets/avatars/Avatar-5.png';
  avatar5 = '../../../assets/avatars/Avatar-6.png';
  avatar6 = '../../../assets/avatars/Avatar-7.png';
  avatar7 = '../../../assets/avatars/Avatar-8.png';
  avatarSelect = '';

  constructor() {
    // Recuperar el avatar seleccionado desde sessionStorage
   if (this.isBrowser()) {
     const savedAvatar = sessionStorage.getItem('selectedAvatar');
     if (savedAvatar) {
       this.avatarSelect = savedAvatar;
     } else {
       this.avatarSelect =
         'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp';
     }
   }

    this.avatar_list[0] = this.avatar0;
    this.avatar_list[1] = this.avatar1;
    this.avatar_list[2] = this.avatar2;
    this.avatar_list[3] = this.avatar3;
    this.avatar_list[4] = this.avatar4;
  }

  avatarSelected(avatar: any) {
    this.avatarSelect = avatar;
    // Guardar el avatar seleccionado en sessionStorage
    if (this.isBrowser()) {
      sessionStorage.setItem('selectedAvatar', avatar);
    }
  }

  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.sessionStorage !== 'undefined'
    );
  }
}
