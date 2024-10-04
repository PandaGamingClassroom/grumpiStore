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
export class BlogComponent implements OnInit{

  id_trainer: any | null = '';
  trainer: any;
  profesor: any;
  loading: boolean = true;
  profesorID: string = '';
  posts: any[] = [];

  constructor(private trainersService: TrainerService){}

  ngOnInit(): void {
    this.id_trainer = localStorage.getItem('id_trainer');
    this.getTrainerData(this.id_trainer);
    this.getDadataProfesor(this.profesorID);
    this.obtenerPosts();
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
          this.profesorID = data.data.id_profesor;
          this.trainer = data.data;
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
  getDadataProfesor(name: string) {
    this.trainersService.getProfesorByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.profesor = data.data;
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
    this.trainersService.obtenerPost(this.profesor).subscribe(
      (data) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error al obtener los posts', error);
      }
    );
  }

  disableRightClick(event: MouseEvent) {
    event.preventDefault();
  }
}
