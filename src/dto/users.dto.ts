export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  dateOfBirth?: Date;
  contactNo?: string;
  address?: string;
  accountVerificationHash?: string;
  forgotPasswordHash?: string;
  isActive?: boolean;
  isLocked?: boolean;
  isVerified?: boolean;
  lockedReason?: string;
  userHash?: string;
  userId?: string;
  token?: string;
}