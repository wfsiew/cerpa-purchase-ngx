import { BaseEntity } from '../../shared';
import { Group } from '..';

export class User implements BaseEntity {
  constructor(
    public id?: number,
    public firstName?: string,
    public lastName?: string,
    public groups?: Group[]
  ) {}
}
