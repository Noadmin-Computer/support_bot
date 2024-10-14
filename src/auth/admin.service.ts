import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateAdminDto } from './dto/update.dto';
import { Admin, AdminDocument } from './entities/admin.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async findOne(email: string): Promise<Admin | null> {
    console.log('Finding admin with email:', email);
    return this.adminModel.findOne({ email }).exec();
  }

  async update(email: string, updateAdminDto: UpdateAdminDto): Promise<Admin> {
    const admin = await this.adminModel
      .findOneAndUpdate({ email }, updateAdminDto, { new: true })
      .exec();
    if (!admin) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
    return admin;
  }

  async remove(email: string): Promise<void> {
    const result = await this.adminModel.deleteOne({ email }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Admin with email ${email} not found`);
    }
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }

  async create(admin: Partial<Admin>): Promise<Admin> {
    const newAdmin = new this.adminModel(admin);
    return newAdmin.save();
  }
  async findByRefreshToken(refreshToken: string): Promise<Admin | null> {
    return this.adminModel.findOne({ refreshToken }).exec();
  }

  async updateRefreshToken(
    adminId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.adminModel.findByIdAndUpdate(adminId, { refreshToken }).exec();
  }
}
