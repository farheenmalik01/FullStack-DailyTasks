import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('my_stuff')
export class MyStuff {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.myStuff)
  @JoinColumn({ name: 'userId' })
  user: User;
}
