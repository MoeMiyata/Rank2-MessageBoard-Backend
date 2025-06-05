import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  email: string;

  @Column('varchar')
  token: string;

  @Column({ default: false })
  used: boolean;

  @Column()
  expire_at: Date;

  @CreateDateColumn()
  ip: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}
