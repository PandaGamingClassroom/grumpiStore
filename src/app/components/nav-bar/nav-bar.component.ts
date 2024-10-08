import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../services/trainers/trainer.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
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

  constructor(private trainersService: TrainerService) {}

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

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
