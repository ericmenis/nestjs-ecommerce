import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { Category } from '../../database/entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Product } from 'src/database/entities/product.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), UserModule],
  controllers: [ProductController],
  providers: [ProductService, AuthGuard, RolesGuard],
})
export class ProductModule {}
