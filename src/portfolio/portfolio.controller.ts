import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@Request() req) {
    // Chỉ trả về portfolio của user đang đăng nhập
    return {
      message: 'Danh sách portfolio của bạn',
      data: await this.portfolioService.findByUser(req.user.userId),
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() data: any, @Request() req) {
    // Gán user cho portfolio
    const portfolio = await this.portfolioService.create({
      ...data,
      user: { id: req.user.userId },
    });
    return {
      message: 'Tạo portfolio thành công',
      data: portfolio,
    };
  }
}
