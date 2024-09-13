import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TrainerService } from '../../services/trainers/trainer.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-medals-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  providers: [TrainerService],
  templateUrl: './medals-list.component.html',
  styleUrls: ['./medals-list.component.scss'],
})
export class MedalsListComponent implements OnInit {
  @Output() energiesSelected = new EventEmitter<
    { type: string; quantity: number }[]
  >();

  trainer: any;
  username: string | null = '';
  energiesToSpend: { type: string; quantity: number }[] = [];
  groupedEnergies: { type: string; quantity: number }[] = [];
  totalEnergiesSelected: number = 0; // Nueva propiedad para el total

  constructor(
    private trainersService: TrainerService,
    public dialogRef: MatDialogRef<MedalsListComponent>
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username) {
        this.getTrainerData(username);
      }
    }
  }

  getTrainerData(name: string): void {
    this.trainersService.getTrainerByName(name).subscribe(
      (data) => {
        if (data.message) {
          console.log(data.message);
        } else {
          this.trainer = data.data;
          console.log(
            'Datos del entrenador para obtener las energías: ',
            this.trainer
          );
          this.groupedEnergies = this.groupEnergies(this.trainer.energies);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  groupEnergies(energies: any[]): { type: string; quantity: number }[] {
    const grouped: { [type: string]: number } = {};
    for (let energy of energies) {
      grouped[energy.tipo] = (grouped[energy.tipo] || 0) + 1;
    }
    return Object.keys(grouped).map((type) => ({
      type,
      quantity: grouped[type],
    }));
  }

  getEnergyQuantity(type: string): number {
    return (
      this.groupedEnergies.find((energy) => energy.type === type)?.quantity || 0
    );
  }

  onQuantityChange(type: string, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    const energyIndex = this.energiesToSpend.findIndex((e) => e.type === type);

    if (energyIndex > -1) {
      if (quantity > 0) {
        this.energiesToSpend[energyIndex].quantity = quantity;
      } else {
        this.energiesToSpend.splice(energyIndex, 1);
      }
    } else if (quantity > 0) {
      this.energiesToSpend.push({ type, quantity });
    }

    // Actualizar el total de energías seleccionadas
    this.totalEnergiesSelected = this.energiesToSpend.reduce(
      (sum, energy) => sum + energy.quantity,
      0
    );
  }

  close() {
    this.dialogRef.close();
  }

  confirmSelection(): void {
    this.energiesSelected.emit(this.energiesToSpend);
    this.dialogRef.close();
  }
}
