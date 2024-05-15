import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavBarComponent } from '../../../nav-bar/nav-bar.component';

@Component({
  selector: 'app-bag',
  standalone: true,
  imports: [RouterLink, NavBarComponent],
  templateUrl: './bag.component.html',
  styleUrl: './bag.component.scss'
})
export class BagComponent {


  marcasCombate: any;

}
