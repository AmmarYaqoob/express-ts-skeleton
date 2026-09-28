import { User } from '../database/entities/users.model';
import { UserDto } from '../dto/users.dto';

class UserRepository {
  async findAll(): Promise<User[]> {
    return User.findAll({ include: ['role'] });
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id, { include: ['role'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async create(data: UserDto): Promise<User> {
    return User.create(data);
  }

  async update(
    id: string,
    data: Partial<UserDto>,
  ): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) return null;

    return user.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }

  async login(email: string, password: string): Promise<User | null> {
    return User.findOne({
      where: {
        email: email,
        password: password,
        isActive: true,
      },
    });
  };

  async save(user: User): Promise<User> {
    return user.save();
  }

  async userVerfication(user: any) {
    return User.findOne({
      where: {
        isVerified: false,
        email: user.email,
        accountVerificationHash: user.accountVerificationHash,
      },
    });
  };
}

export default new UserRepository();