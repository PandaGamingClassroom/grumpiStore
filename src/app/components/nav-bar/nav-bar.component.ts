import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../services/trainers/trainer.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  providers: [TrainerService],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {
  avatarSelect = '';
  avatar = localStorage.getItem('selectedAvatar');
  trainer: any;
  username: string | null = '';
  trainer_id: any;
  menuOpen = false;

  constructor(
    private trainersService: TrainerService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      this.username = localStorage.getItem('username');
      this.trainer_id = localStorage.getItem('id_trainer');
      if (this.username && this.trainer_id) {
        this.getTrainerData(this.trainer_id);
      }
    }
  }

  getTrainerData(id: number): void {
    this.trainersService.getTrainerById(id).subscribe(
      (data) => {
        if (data.success === false) {
          console.log(data.error);
        } else {
          this.trainer = data.data;
          this.avatar = this.trainer.avatar;
          this.avatarSelect = this.trainer.avatar;
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
