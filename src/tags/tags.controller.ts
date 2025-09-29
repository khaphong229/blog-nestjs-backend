import { Controller, Get, Post, Body } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags() {
    return {
      message: 'Danh sách tất cả tag',
      data: await this.tagsService.findAll(),
    };
  }

  @Post()
  async createTag(@Body('name') name: string) {
    const tag = await this.tagsService.create(name);
    return {
      message: 'Tạo tag thành công',
      data: tag,
    };
  }
}
