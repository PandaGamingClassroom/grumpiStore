import { Injectable } from '@angular/core';
import { Attacks, Grumpi } from '../../../models/grumpi';

@Injectable({
  providedIn: 'root',
})
export class BattleService {
  constructor() {}
  attack(attacker: Grumpi, defender: Grumpi, move: Attacks): void {

  }
}
