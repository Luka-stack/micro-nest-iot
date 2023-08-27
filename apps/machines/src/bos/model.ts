import { Producent } from './producent';
import { Type } from './type';

export interface Model {
  id: number;

  name: string;

  workBase: number;

  workRange: number;

  faultRate: number;

  minRate: number;

  maxRate: number;

  defaultRate: number;

  producent: Producent;

  type: Type;

  typeId: number;

  producentId: number;
}
