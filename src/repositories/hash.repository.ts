import { Op } from 'sequelize';
import { Hashing, HashingCreationAttributes } from '../database/entities/hashing.model';

class HashRepository {
  async create(data: HashingCreationAttributes): Promise<Hashing> {
    return Hashing.create(data);
  }

  async findById(id: string): Promise<Hashing | null> {
    return Hashing.findByPk(id);
  }

  async findByHash(hash: string): Promise<Hashing | null> {
    return Hashing.findOne({
      where: { hash },
    });
  }

  async findByType(type: string): Promise<Hashing[]> {
    return Hashing.findAll({
      where: { type },
    });
  }

  async findByTypeAndHash(
    type: string,
    hash: string,
  ): Promise<Hashing | null> {
    return Hashing.findOne({
      where: {
        type,
        hash,
      },
    });
  }

  async update(
    id: string,
    data: Partial<HashingCreationAttributes>,
  ): Promise<Hashing | null> {
    const record = await this.findById(id);

    if (!record) return null;

    return record.update(data);
  }

  async findActiveByUserAndType(
    userId: string,
    type: string,
  ): Promise<Hashing | null> {
    return Hashing.findOne({
      where: {
        userId,
        type,
        expiredAt: { [Op.gt]: new Date() },
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async deleteByUserAndType(userId: string, type: string): Promise<void> {
    await Hashing.destroy({
      where: { userId, type },
    });
  }

  async delete(id: string): Promise<boolean> {
    const record = await this.findById(id);

    if (!record) return false;

    await record.destroy();

    return true;
  }
}

export default new HashRepository();