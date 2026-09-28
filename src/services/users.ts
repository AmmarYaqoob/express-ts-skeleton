import * as joi from 'joi';
import config from '../config/index';
import AppError from '../middlewares/apperror';
import { comparePassword, hashPassword } from '../utils/password';
import { createRawToken, hashToken, tokenMatches } from '../utils/token';
import { IEmail } from '../interfaces/email';
import { sendMail } from './email';
import { StatusCodes } from 'http-status-codes';
import userRepo from '../repositories/users.repository';
import { User } from '../database/entities/users.model';
import { UserDto } from '../dto/users.dto';
import { authConstant } from '../constants/authConstant';
import hashRepo from '../repositories/hash.repository';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const DUMMY_PASSWORD_HASH =
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

const TokenType = {
  emailVerification: 'email_verification',
  passwordReset: 'password_reset',
} as const;

type TokenTypeName = (typeof TokenType)[keyof typeof TokenType];

class UserService {
  private async issueToken(userId: string, type: TokenTypeName): Promise<string> {
    const raw = createRawToken();
    const now = new Date();

    await hashRepo.deleteByUserAndType(userId, type);
    await hashRepo.create({
      userId,
      type,
      hash: hashToken(raw),
      expiredAt: new Date(now.getTime() + TOKEN_TTL_MS),
      createdAt: now,
    });

    return raw;
  }

  private async tokenIsValid(
    userId: string,
    type: TokenTypeName,
    token: string,
  ): Promise<boolean> {
    const record = await hashRepo.findActiveByUserAndType(userId, type);

    if (!record) {
      return false;
    }

    return tokenMatches(record.hash, token);
  }

  private async consumeToken(
    userId: string,
    type: TokenTypeName,
    token: string,
  ): Promise<boolean> {
    const record = await hashRepo.findActiveByUserAndType(userId, type);

    if (!record || !tokenMatches(record.hash, token)) {
      return false;
    }

    await hashRepo.delete(record.id);
    return true;
  }

  private authLink(path: string, userId: string, token: string): string {
    const params = new URLSearchParams({ user: userId, token });
    return `${config.api.baseURL}/${path}?${params.toString()}`;
  }

  private async sendAuthMail(
    user: User,
    subject: string,
    link: string,
    template?: string,
  ): Promise<void> {
    const email: IEmail = {
      isText: false,
      subject,
      to: [user.email],
      firstName: user.firstName,
      key: link,
      template,
    };

    await sendMail(email);
  }

  async login(user: UserDto) {
    const scheme = joi.object({
      email: joi.string().required(),
      password: joi.string().required(),
    });
    await scheme.validateAsync({ email: user.email, password: user.password });

    const userData = await userRepo.findByEmail(user.email);
    const passwordMatches = await comparePassword(
      user.password,
      userData?.password ?? DUMMY_PASSWORD_HASH,
    );

    if (!userData || !passwordMatches) {
      throw new AppError(
        'Invalid email or password',
        StatusCodes.UNAUTHORIZED,
      );
    }

    if (userData.isLocked) {
      throw new AppError('Account is locked', StatusCodes.LOCKED);
    }

    if (!userData.isVerified) {
      const token = await this.issueToken(
        userData.id,
        TokenType.emailVerification,
      );
      await this.sendAuthMail(
        userData,
        authConstant.emailVerification,
        this.authLink('sign-in', userData.id, token),
      );

      return {
        verified: false,
        message: authConstant.verifyLink,
      };
    }

    return {
      verified: true,
      email: userData.email,
      id: userData.id,
      userName: `${userData.firstName} ${userData.lastName}`,
    };
  }

  async signUp(user: UserDto) {
    const scheme = joi.object({
      firstName: joi.string().required(),
      email: joi.string().required(),
      password: joi.string().required(),
      contactNo: joi.string().required(),
    });
    await scheme.validateAsync({
      firstName: user.firstName,
      email: user.email,
      password: user.password,
      contactNo: user.contactNo,
    });

    const existingUser = await userRepo.findByEmail(user.email);
    if (existingUser) {
      throw new AppError(authConstant.alreadyExists, StatusCodes.CONFLICT);
    }

    const created = await userRepo.create({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contactNo: user.contactNo,
      password: await hashPassword(user.password),
      isActive: true,
      isLocked: false,
      isVerified: false,
      roleId: 2,
    });

    const token = await this.issueToken(
      created.id,
      TokenType.emailVerification,
    );
    await this.sendAuthMail(
      created,
      authConstant.emailVerification,
      this.authLink('sign-in', created.id, token),
    );

    return {
      message: authConstant.verifyLink,
    };
  }

  async verifyUserHash(user: UserDto) {
    const checkUser = user.userId
      ? await userRepo.findById(user.userId)
      : null;
    const consumed =
      checkUser !== null &&
      (await this.consumeToken(
        checkUser.id,
        TokenType.emailVerification,
        user.token as string,
      ));

    if (!checkUser || !consumed) {
      throw new AppError(authConstant.invalidKey, StatusCodes.BAD_REQUEST);
    }

    checkUser.isVerified = true;
    await userRepo.save(checkUser);

    return {
      message: authConstant.verified,
    };
  }

  async verfication(user: UserDto) {
    const scheme = joi.object({
      email: joi.string().required(),
      token: joi.string().required(),
    });
    await scheme.validateAsync({ email: user.email, token: user.token });

    const objUser = await userRepo.findByEmail(user.email);
    const consumed =
      objUser !== null &&
      (await this.consumeToken(
        objUser.id,
        TokenType.emailVerification,
        user.token as string,
      ));

    if (!objUser || !consumed) {
      throw new AppError(authConstant.invalidKey, StatusCodes.BAD_REQUEST);
    }

    objUser.isVerified = true;
    const userData = await userRepo.save(objUser);

    return {
      email: userData.email,
      id: userData.id,
      userName: userData.firstName + ' ' + userData.lastName,
    };
  }

  async forgetPassword(user: UserDto) {
    const scheme = joi.object({
      email: joi.string().required(),
    });
    await scheme.validateAsync({ email: user.email });

    const checkUser = await userRepo.findByEmail(user.email);

    if (checkUser) {
      const token = await this.issueToken(
        checkUser.id,
        TokenType.passwordReset,
      );
      await this.sendAuthMail(
        checkUser,
        authConstant.resetPassword,
        this.authLink('forgot-password', checkUser.id, token),
        'forget',
      );
    }

    return {
      success: true,
      message: authConstant.resetLink,
    };
  }

  async verifyForgetHash(user: UserDto) {
    const valid = user.userId
      ? await this.tokenIsValid(
          user.userId,
          TokenType.passwordReset,
          user.token ?? '',
        )
      : false;

    if (!valid) {
      throw new AppError(authConstant.invalidKey, StatusCodes.BAD_REQUEST);
    }

    return { success: true };
  }

  async resetPassword(user: UserDto) {
    const checkUser = user.userId
      ? await userRepo.findById(user.userId)
      : null;
    const consumed =
      checkUser !== null &&
      (await this.consumeToken(
        checkUser.id,
        TokenType.passwordReset,
        user.token as string,
      ));

    if (!checkUser || !consumed) {
      throw new AppError(authConstant.invalidKey, StatusCodes.BAD_REQUEST);
    }

    checkUser.password = await hashPassword(user.password);
    await userRepo.save(checkUser);

    return {
      success: true,
      message: authConstant.passwordUpdate,
    };
  }

  async getAll() {
    return userRepo.findAll();
  }

  async getById(id: string) {
    const user = await userRepo.findById(id);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return user;
  }

  async create(payload: UserDto) {
    const existingUser = await userRepo.findByEmail(payload.email);
    if (existingUser) {
      throw new AppError('Email already exists', StatusCodes.BAD_REQUEST);
    }
    return userRepo.create(payload);
  }

  async update(id: string, payload: Partial<UserDto>) {
    const user = await userRepo.update(id, payload);
    if (!user) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return user;
  }

  async delete(id: string) {
    const deleted = await userRepo.delete(id);
    if (!deleted) {
      throw new AppError('User not found', StatusCodes.NOT_FOUND);
    }
    return;
  }
}

export default new UserService();
