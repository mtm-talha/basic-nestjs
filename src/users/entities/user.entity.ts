import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn({
    name: 'id',
    type: 'int',
  })
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
  })
  name: string;

  @Index('idx_users_email')
  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    length: 255,
  })
  email: string;

  @Column({
    name: 'age',
    type: 'int',
    nullable: true,
  })
  age: number;
}
