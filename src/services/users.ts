import * as joi from 'joi';
import AppError from '../middlewares/apperror';
import { compareHash, encrypt } from '../utils/encryptdecrypt';
import { IEmail } from '../interfaces/email';
import { sendMail } from './email';
import { StatusCodes } from 'http-status-codes';
import userRepo from '../repositories/users';
import { UserDto } from '../dto/users.dto';
import { authConstant } from '../constants/authConstant';

class UserService {
    async login(user: UserDto) {
        const scheme = joi.object({
            email: joi.string().required(),
            password: joi.string().required(),
        });
        await scheme.validateAsync({ email: user.email, password: user.password });
        let password = await encrypt(user.password);
        const userData = await userRepo.findByEmail(user.email);
        if (!userData) {
            throw new AppError('Invalid email or password', StatusCodes.NOT_FOUND);
        }
        const isValidPassword = await compareHash(user.password, userData.password);
        if (!isValidPassword) {
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
            // userData.accountVerificationHash = CryptoJS.AES.encrypt(
            //     JSON.stringify(key),
            //     'secret_key',
            // ).toString();
            let userDate = await userRepo.save(userData);
            // let userHash = CryptoJS.AES.encrypt(JSON.stringify(userDate.id), 'secret_key').toString();
            // let link = `http://localhost:4200/sign-in?user=${encodeURIComponent(
            //     userHash,
            // )}&key=${encodeURIComponent(userData.accountVerificationHash)}`;

            // const email: IEmail = <IEmail>{
            //     isText: false,
            //     subject: authConstant.emailVerification,
            //     to: [userData.email],
            //     firstName: userData.firstName,
            //     key: link,
            // };
            // await sendMail(email);
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

        const verificationCode = await encrypt(user.password);
        let key: string = Math.floor(1000 + Math.random() * 9000).toString();
        // toSaveUser.accountVerificationHash = CryptoJS.AES.encrypt(
        //     JSON.stringify(key),
        //     'secret_key',
        // ).toString();
        // const createdUser = await userRepo.create({
        //     ...user,
        //     password: await encrypt(user.password),
        //     isActive: true,
        //     isLocked: false,
        //     isVerified: false,
        //     roleId: 2,
        //     accountVerificationHash: verificationCode,
        // });

        // const verificationLink = buildVerificationLink(
        //     createdUser.id,
        //     verificationCode,
        // );

        // await sendMail(
        //     createdUser.email,
        //     createdUser.firstName,
        //     verificationLink,
        // );

        return {
            message: authConstant.verifyLink,
        };
    }

    async verifyUserHash(user: UserDto) {
        var bytes = CryptoJS.AES.decrypt(user.userHash, 'secret_key');
        var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

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
        user.accountVerificationHash = CryptoJS.SHA256(user.accountVerificationHash).toString();
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
        let checkUser = await userRepo.getByEmail(user.email);
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }
        const hashing = new Hashing();
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(checkUser.id), 'secret_key').toString();

        let key: string = Math.floor(1000 + Math.random() * 9000).toString();
        hashing.hash = CryptoJS.SHA256(key).toString();
        hashing.type = ciphertext;
        let date = new Date();
        hashing.createdAt = date;
        hashing.expiredAt = new Date(date.getTime() + 60 * 24 * 60000);
        hashing.createdBy = date;
        hashing.updatedAt = date;
        hashing.updatedBy = date;
        let link = `http://localhost:4200/forgot-password?user=${encodeURIComponent(
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
        await emailService.sendMail(email);

        await hashRepo.save(hashing);
        return {
            success: true,
            message: authConstant.resetLink,
        };
    };

    async verifyForgetHash(user: UserDto) {
        var bytes = CryptoJS.AES.decrypt(user.userHash, 'secret_key');
        var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        let checkUser = await userRepo.getOneById(parseInt(originalText));
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }
        // let res = await hashRepo.getByHasingId(user.userHash, user.forgetHash);

        return { success: true };
    };

    async resetPassword(user: UserDto) {
        var bytes = CryptoJS.AES.decrypt(user.userHash, 'secret_key');
        var originalText = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        let checkUser = await userRepo.getOneById(parseInt(originalText));
        if (!checkUser) {
            return { success: false, message: authConstant.notExists };
        }
        checkUser.password = CryptoJS.SHA256(user.password).toString();
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