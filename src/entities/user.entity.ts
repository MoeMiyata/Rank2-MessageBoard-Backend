import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['name']) // nameが一意であることを保証
@Unique(['email']) // emailが一意であることを保証
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column('varchar')
  name: string;

  @Column('varchar')
  hash: string;

  @Column('varchar')
  email: string;

  @CreateDateColumn()
  readonly created_at?: Date;

  @UpdateDateColumn()
  readonly updated_at?: Date;

  // ユーザ情報の編集で追加
  @Column({ type: 'date', nullable: true })
  birthday?: string | undefined;

  @Column({ type: 'varchar', default: '登録なし' })
  address?: string;

  @Column({ type: 'varchar', default: '登録なし' })
  tel?: string;
}
