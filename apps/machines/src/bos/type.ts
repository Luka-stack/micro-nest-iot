import { Producent } from './producent';

export interface Type {
  id: number;

  name: string;

  imageUrl: string;

  producents: Producent[];
}
