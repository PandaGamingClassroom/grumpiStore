export interface Grumpi {
  id: number;
  name: string;
  description: string;
  number_grumpidex: string;
  image: string;
  salud: number;
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

export interface CartaGrumpi {
  id: number;
  image: string;
}

/**
 *
 *
 *  DEFINICIÓN DEL ARRAY DE ATAQUES
 *
 *
 *
 */

export const attacks: Attacks[] = [
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

/**
 *
 *
 *  DEFINICIÓN DEL ARRAY DE GRUMPIS
 *
 *
 *
 */
export const grumpis: Grumpi[] = [
  {
    id: 1,
    name: 'Bugi',
    description: 'Descripción del Grumpi 1',
    number_grumpidex: '001',
    image: '../../../../assets/grumpis/001-Bugi.jpeg',
    salud: 0,
    attacks: [attacks[0], attacks[1]],
  },
  {
    id: 2,
    name: 'Bolibugi',
    description: 'Descripción del Grumpi 2',
    number_grumpidex: '002',
    image: '../../../../assets/grumpis/002-Bolibugi.jpeg',
    salud: 0,
    attacks: [attacks[2], attacks[3]],
  },
  {
    id: 3,
    name: 'Bugelion',
    description: 'Descripción del Grumpi 3',
    number_grumpidex: '003',
    image: '../../../../assets/grumpis/003-Bugelion.jpeg',
    salud: 0,
    attacks: [attacks[4], attacks[5]],
  },
];

export const cartas_grumpi: CartaGrumpi[] = [
  {
    id: 1,
    image: '../../../../assets/cards/001.1.png',
  },
  {
    id: 2,
    image: '../../../../assets/cards/002.1.png',
  },
  {
    id: 3,
    image: '../../../../assets/cards/003.1.png',
  },
  {
    id: 4,
    image: '../../../../assets/cards/004.1.png',
  },
  {
    id: 5,
    image: '../../../../assets/cards/005.1.png',
  },
  {
    id: 6,
    image: '../../../../assets/cards/006.1.png',
  },
  {
    id: 7,
    image: '../../../../assets/cards/007.1.png',
  },
  {
    id: 8,
    image: '../../../../assets/cards/008.1.png',
  },
  {
    id: 9,
    image: '../../../../assets/cards/009.1.png',
  },
];
