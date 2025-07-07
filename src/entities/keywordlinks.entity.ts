import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class KeywordLinks {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('varchar')
  keyword: string;

  @Column('varchar')
  url: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;
}
