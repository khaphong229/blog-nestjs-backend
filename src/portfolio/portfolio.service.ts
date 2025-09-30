import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  findAll(): Promise<Portfolio[]> {
    return this.portfolioRepository.find({ relations: ['user'] });
  }

  create(data: Partial<Portfolio>): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create(data);
    return this.portfolioRepository.save(portfolio);
  }

  async findByUser(userId: number): Promise<Portfolio[]> {
    return this.portfolioRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
