import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from './roles.model';
import { UserDto } from '../../dto/users.dto';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
// export class User extends Model<User> {
export class User extends Model<User, UserDto> implements User {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare firstName: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  declare lastName: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare email: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  declare dateOfBirth?: Date;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  declare contactNo?: string;

  @AllowNull(true)
  @Column(DataType.STRING(500))
  declare address?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare accountVerificationHash?: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare forgotPasswordHash?: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  declare password: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  declare isActive: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isLocked: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  declare isVerified: boolean;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  declare lockedReason?: string;

  @ForeignKey(() => Role)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare roleId: number;

  @BelongsTo(() => Role)
  declare role: Role;
}