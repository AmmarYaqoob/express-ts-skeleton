import userReporsitory from '../repositories/users'

class UserService {
    async getUsers() {
        return userReporsitory.findAll();
    }

    // async createUser(dto) {
    //     const user = await userReporsitory.findById(dto.email);

    //     // if (user) {
    //     //     throw new AppError(
    //     //         'Email already exists',
    //     //         HTTP_STATUS.BAD_REQUEST,
    //     //     );
    //     // }

    //     return userReporsitory.create(dto);
    // }
}

export default new UserService();