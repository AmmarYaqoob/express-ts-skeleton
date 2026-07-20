import { User } from '../database/entities/users.model';
import { UserDto } from '../dto/users.dto';

class UserRepository {
  async findAll(): Promise<User[]> {
    return User.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async create(payload: UserDto): Promise<User> {
    return User.create(payload);
  }

  async update(id: string, payload: UserDto): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    return user.update(payload);
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.findById(id);

    if (!user) {
      return false;
    }

    await user.destroy();

    return true;
  }
}

export default new UserRepository();