import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface HashingAttributes {
  id: string;
  userId: string | null;
  type: string;
  hash: string;
  expiredAt: Date;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: Date;
  updatedBy?: Date;
}

export interface HashingCreationAttributes
  extends Optional<
    HashingAttributes,
    'id' | 'userId' | 'updatedAt' | 'createdBy' | 'updatedBy'
  > {}

@Table({
  tableName: 'hashing',
  timestamps: false,
})
export class Hashing extends Model<
  HashingAttributes,
  HashingCreationAttributes
> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  declare userId: string | null;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare type: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare hash: string;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare expiredAt: Date;

  @AllowNull(false)
  @Column(DataType.DATE)
  declare createdAt: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare updatedAt?: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare createdBy?: Date;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare updatedBy?: Date;
}