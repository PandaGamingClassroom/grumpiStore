import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CommonModule } from '@angular/common';
import { AvatarService } from '../services/avatar/avatar.service';
import { TrainerService } from '../services/trainers/trainer.service';
import { GrumpiService } from '../services/grumpi/grumpi.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, NavBarComponent, CommonModule, FooterComponent],
  providers: [GrumpiService, TrainerService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
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
  username: string | null = '';
  trainerList: any[] = [];
  trainer: any;
  trainerName: string = '';
  errorMessage: string = '';

  constructor(
    private avatarService: AvatarService,
    private trainersService: TrainerService
  ) {
    this.avatar_list = [
      this.avatar0,
      this.avatar1,
      this.avatar2,
      this.avatar3,
      this.avatar4,
      this.avatar5,
      this.avatar6,
      this.avatar7,
    ];
  }

  ngOnInit(): void {
    this.avatarService.loadAvatarFromStorage();
    this.avatarService.avatar$.subscribe((avatar) => {
      this.avatarSelect = avatar;
    });
    this.username = localStorage.getItem('username');
  }

  avatarSelected(avatar: any) {
    this.avatarService.setAvatar(avatar);
  }

  loadAvatarFromStorage() {
    if (typeof localStorage !== 'undefined') {
      // Acceder a localStorage aquí
      const avatar = localStorage.getItem('avatar');
      if (avatar) {
        this.avatarService.setAvatar(avatar); // Utiliza el servicio para establecer el avatar
      }
    } else {
      console.error('localStorage is not supported in this environment.');
    }
  }
}
