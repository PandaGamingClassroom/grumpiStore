import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AvatarService } from '../services/avatar/avatar.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {

  avatarSelect = '';
  constructor(private avatarService: AvatarService) {}

  ngOnInit(): void {
    this.avatarService.avatar$.subscribe((avatar) => {
      this.avatarSelect = avatar;
    });
  }
}
