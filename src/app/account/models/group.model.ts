import { BaseEntity } from '../../shared';
import { Permission } from '..';

export class Group implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public permissions?: Permission[]
  ) {
  }
}