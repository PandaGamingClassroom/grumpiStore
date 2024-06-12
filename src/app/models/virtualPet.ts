export class Pet {
  hunger: number;
  happiness: number;
  cleanliness: number;
  isAlive: boolean;

  constructor() {
    this.hunger = 100;
    this.happiness = 100;
    this.cleanliness = 100;
    this.isAlive = true;
  }
}
