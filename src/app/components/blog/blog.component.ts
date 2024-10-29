import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { FooterComponent } from '../footer/footer.component';
import { TrainerService } from '../services/trainers/trainer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink, NavBarComponent, FooterComponent, CommonModule],
  providers: [TrainerService],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit {
  id_trainer: any | null = '';
  trainer: any;
  profesor: any;
  loading: boolean = true;
  posts: any[] = [];
  isLoading = false;

  constructor(private trainersService: TrainerService) {}

  ngOnInit(): void {
    this.id_trainer = localStorage.getItem('id_trainer');
    this.getTrainerData(this.id_trainer);
  }

  /**
   * Se obtienen los datos del entrenador
   *
   * @param id
   */
  getTrainerData(id: number): void {
    this.trainersService.getTrainerById(id).subscribe(
      (data) => {
        if (data.success === false) {
          console.log(data.error);
        } else {
          this.trainer = data.data;
          this.getDadataProfesor(data.data.id_profesor);
          console.log('Datos del entrenador: ', this.trainer);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  /**
   * Se obtienen los datos del profesor para este entrenador
   * @param name
   */
  getDadataProfesor(id: number) {
    this.trainersService.getProfesor(id).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data;
          this.obtenerPosts();
          console.log('Datos del profesor: ', this.profesor);
        }
      },
      (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    );
  }

  /**
   * Se obtienen los posts creados por un profesor
   */
  obtenerPosts() {
    this.isLoading = true;
    this.trainersService.obtenerPost(this.profesor.id).subscribe(
      (data) => {
        this.posts = data.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener los posts', error);
        this.isLoading = false;
      }
    );
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
