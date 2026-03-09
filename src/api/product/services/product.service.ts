import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, ProductDetailsDto } from '../dto/product.dto';
import { Category } from '../../../database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { errorMessages } from 'src/errors/custom';
import { validate } from 'class-validator';
import { successObject } from 'src/common/helper/sucess-response.interceptor';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getProduct(productId: number) {
    const product = await this.productRepository.findOneBy({
      id: productId,
    });

    if (!product) throw new NotFoundException(errorMessages.product.notFound);

    return product;
  }

  async createProduct(data: CreateProductDto, merchantId: number) {
    const category = await this.categoryRepository.findOneBy({
      id: data.categoryId,
    });

    if (!category) throw new NotFoundException(errorMessages.category.notFound);

    const product = await this.productRepository.create({
      ...data,
      category,
      merchantId,
    });

    return this.productRepository.save(product);
  }

  async addProductDetails(
    productId: number,
    body: ProductDetailsDto,
    merchantId: number,
  ) {
    const result = await this.productRepository
      .createQueryBuilder()
      .update()
      .set({ ...body })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id'])
      .execute();

    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);

    return result.raw[0];
  }

  async activateProduct(productId: number, merchantId: number) {
    if (!(await this.validate(productId)))
      throw new ConflictException(errorMessages.product.notFulfilled);

    const result = await this.productRepository
      .createQueryBuilder()
      .update()
      .set({ isActive: true })
      .where('id = :id', { id: productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .returning(['id', 'isActive'])
      .execute();

    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);

    return result.raw[0];
  }

  async validate(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException(errorMessages.product.notFound);

    const errors = await validate(product);
    return errors.length === 0;
  }

  async deleteProduct(productId: number, merchantId: number) {
    const result = await this.productRepository
      .createQueryBuilder()
      .delete()
      .where('id = :productId', { productId })
      .andWhere('merchantId = :merchantId', { merchantId })
      .execute();

    if (result.affected < 1)
      throw new NotFoundException(errorMessages.product.notFound);

    return successObject;
  }
}
