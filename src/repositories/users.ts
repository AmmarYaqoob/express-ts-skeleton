import { User } from '../database/entities/users'

class UserRepository {
    async findAll() {
        return User.findAll();
    }

    async findById(id: number) {
        return User.findByPk(id);
    }

    async create(data: any) {
        return User.create(data);
    }
}

export default new UserRepository();