import { Medal } from "./medal";

export interface Trainer {
  id: number;
  name: string;
  password: string;
  grumpidolars: number;
  medalls: [Medal];
}
