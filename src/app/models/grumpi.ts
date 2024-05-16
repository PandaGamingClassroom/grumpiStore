export interface Grumpi {
  id: number;
  name: string;
  description: string;
  number_grumpidex: string;
  image: string;
  attacks: Attacks[];
}
export interface Attacks {
  id: number;
  name: string;
  description: string;
  damage: string;
  energy_type: string;
  image_energy: string;
}


const attacks: Attacks[] = [
  {
    id: 1,
    name: 'Placaje',
    description: '-',
    damage: '10',
    energy_type: 'Normal',
    image_energy: 'imagen1.png',
  },
  {
    id: 2,
    name: 'Espora seta',
    description: '-',
    damage: '30',
    energy_type: 'Vida',
    image_energy: 'imagen2.png',
  },
  {
    id: 3,
    name: 'Protección',
    description: 'Anula un ataque. Ataca en primer lugar siguiente turno',
    damage: 'Anula un ataque. Ataca en primer lugar siguiente turno',
    energy_type: 'Normal',
    image_energy: 'imagen2.png',
  },
  {
    id: 4,
    name: 'Rodar',
    description: '-',
    damage: '40',
    energy_type: 'Normal',
    image_energy: 'imagen2.png',
  },
  {
    id: 5,
    name: 'Reflejo',
    description: '-',
    damage: '40',
    energy_type: 'Normal',
    image_energy: 'imagen2.png',
  },
  {
    id: 6,
    name: 'Tajo espora',
    description: '-',
    damage: '40',
    energy_type: 'Normal',
    image_energy: 'imagen2.png',
  },
];

// Define un array de objetos Grumpi
export const grumpis: Grumpi[] = [
  {
    id: 1,
    name: 'Bugi',
    description: 'Descripción del Grumpi 1',
    number_grumpidex: '001',
    image: '../../../../assets/grumpis/001-Bugi.jpeg',
    attacks: [attacks[0], attacks[1]], // Asigna el primer ataque al primer Grumpi
  },
  {
    id: 2,
    name: 'Bolibugi',
    description: 'Descripción del Grumpi 2',
    number_grumpidex: '002',
    image: '../../../../assets/grumpis/002-Bolibugi.jpeg',
    attacks: [attacks[2], attacks[3]], // Asigna el segundo ataque al segundo Grumpi
  },
  {
    id: 3,
    name: 'Bugelion',
    description: 'Descripción del Grumpi 3',
    number_grumpidex: '003',
    image: '../../../../assets/grumpis/003-Bugelion.jpeg',
    attacks: [attacks[4], attacks[5]], // Asigna el segundo ataque al segundo Grumpi
  },
];
