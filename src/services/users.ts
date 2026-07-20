import userReporsitory from '../repositories/users'

class UserService {
    async get() {
        return userReporsitory.findAll();
    }

    async getByID(Id: number) {
        return userReporsitory.findById(Id);
    }

    // async createUser(dto) {
    //     const user = await userReporsitory.findById(dto.email);
    //     if (user) {
    //         throw new AppError(
    //             'Email already exists',
    //             HTTP_STATUS.BAD_REQUEST,
    //         );
    //     }
    //     return userReporsitory.create(dto);
    // }
}

export default new UserService();