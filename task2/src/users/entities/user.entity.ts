import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  email: string;
  
  @Column({ nullable: true })
  password: string;

  @Column({ default: 0 })
  tokenVersion: number;

  @Column({ nullable: true })
  token: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture: string | null;
}
