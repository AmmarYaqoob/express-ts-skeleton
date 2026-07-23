import * as joi from 'joi';
import config from '../config/index';
import AppError from '../middlewares/apperror';
import { decrypt, encrypt, hash } from '../utils/encryptdecrypt';
import { IEmail } from '../interfaces/email';
import { sendMail } from './email';
import { StatusCodes } from 'http-status-codes';
import userRepo from '../repositories/users.repository';
import { UserDto } from '../dto/users.dto';
import { authConstant } from '../constants/authConstant';
import { Hashing } from '../database/entities/hashing.model'
import hashRepo from '../repositories/hash.repository'

class UserService {
    async login(user: UserDto) {
        const scheme = joi.object({
            email: joi.string().required(),
            password: joi.string().required(),
        });
        await scheme.validateAsync({ email: user.email, password: user.password });
        const userData = await userRepo.findByEmail(user.email);
        if (!userData) {
            throw new AppError('Invalid email or password', StatusCodes.NOT_FOUND);
        }
        let password = encrypt(user.password);
        if (password != userData.password) {
            throw new AppError(
                'Invalid email or password',
                StatusCodes.UNAUTHORIZED,
            );
        }

        if (userData.isLocked) {
            throw new AppError(
                'Account is locked',
                StatusCodes.LOCKED,
            );
        }
        if (!userData.isVerified) {
            let key: string = Math.floor(1000 + Math.random() * 9000).toString();
            var hash = encrypt(JSON.stringify(key) + config.secret_key);
            userData.accountVerificationHash = hash;
            let userDate = await userRepo.save(userData);
            let userHash = encrypt(JSON.stringify(userDate.id) + config.secret_key);
            let link = `${config.baseURL}/sign-in?user=${encodeURIComponent(
                userHash,
            )}&key=${encodeURIComponent(userData.accountVerificationHash)}`;

            const email: IEmail = <IEmail>{
                isText: false,
                subject: authConstant.emailVerification,
                to: [userData.email],
                firstName: userData.firstName,
                key: link,
            };
            await sendMail(email);
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
            throw new AppError(
                authConstant.alreadyExists,
                StatusCodes.CONFLICT,
            );
        }

        let toSaveUser = await userRepo.create({
            ...user,
            password: encrypt(user.password),
            isActive: true,
            isLocked: false,
            isVerified: false,
            roleId: 2,
        });

        let userDate = await userRepo.save(toSaveUser);
        let key: string = (Math.floor(1000 + Math.random() * 9000).toString() + config.secret_key);
        toSaveUser.accountVerificationHash = encrypt(key);
        let userHash = encrypt(JSON.stringify(userDate.id) + config.secret_key).toString();
        let link = `${config.baseURL}/sign-in?user=${encodeURIComponent(userHash)
            }&key=${encodeURIComponent(toSaveUser.accountVerificationHash)
            }`;

        const email: IEmail = <IEmail>{
            isText: false,
            subject: authConstant.emailVerification,
            to: [toSaveUser.email],
            firstName: toSaveUser.firstName,
            key: link,
        };
        await sendMail(email);
        return {
            message: authConstant.verifyLink,
        };
    }

    async verifyUserHash(user: UserDto) {
        var originalText = decrypt(user.userHash + config.secret_key);
        let checkUser = await userRepo.findById(originalText);
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }
        checkUser.isVerified = true;
        await userRepo.save(checkUser);

        return {
            message: authConstant.verified,
        };
    };

    async verfication(user: UserDto) {
        const scheme = joi.object({
            email: joi.string().required(),
            accountVerificationHash: joi.string().required(),
        });
        await scheme.validateAsync({
            email: user.email,
            accountVerificationHash: user.accountVerificationHash,
        });
        user.accountVerificationHash = decrypt(user.accountVerificationHash ?? "");
        let objUser = await userRepo.userVerfication(user);
        if (!objUser) {
            return { success: false, message: authConstant.invalidKey };
        }
        objUser.isVerified = true;
        let userData = await userRepo.save(objUser);
        return {
            email: userData.email,
            id: userData.id,
            userName: userData.firstName + ' ' + userData.lastName,
        };
    };

    async forgetPassword(user: UserDto) {
        const scheme = joi.object({
            email: joi.string().required(),
        });
        await scheme.validateAsync({
            email: user.email,
        });
        let checkUser = await userRepo.findByEmail(user.email);
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }

        const hashing = new Hashing();
        var ciphertext = encrypt(JSON.stringify(checkUser.id) + config.secret_key);

        let key: string = Math.floor(1000 + Math.random() * 9000).toString();
        hashing.hash = hash(key);
        hashing.type = ciphertext;
        let date = new Date();
        hashing.createdAt = date;
        hashing.expiredAt = new Date(date.getTime() + 60 * 24 * 60000);
        hashing.createdBy = date;
        hashing.updatedAt = date;
        hashing.updatedBy = date;
        let link = `${config.baseURL}/forgot-password?user=${encodeURIComponent(
            ciphertext,
        )}&key=${encodeURIComponent(hashing.hash)}`;

        const email: IEmail = <IEmail>{
            isText: false,
            subject: authConstant.resetPassword,
            to: [checkUser.email],
            firstName: checkUser.firstName,
            key: link,
            template: 'forget',
        };
        await sendMail(email);

        await hashRepo.create(hashing);
        return {
            success: true,
            message: authConstant.resetLink,
        };
    };

    async verifyForgetHash(user: UserDto) {
        var originalText = decrypt(user.userHash + config.baseURL);

        let checkUser = await userRepo.findById(originalText);
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }

        return { success: true };
    };

    async resetPassword(user: UserDto) {
        var originalText = decrypt(user.userHash + config.secret_key);

        let checkUser = await userRepo.findById(originalText);
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }
        checkUser.password = hash(user.password);
        userRepo.save(checkUser);
        return {
            success: true,
            message: authConstant.passwordUpdate,
        };
    };

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