import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAllPosts(@Query('tag') tag?: string) {
    if (tag) {
      return {
        message: `Bài viết có tag: ${tag}`,
        data: await this.postsService.findByTag(tag),
      };
    }

    return {
      message: 'Danh sách tất cả bài viết',
      data: await this.postsService.findAll(),
    };
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postsService.findOne(parseInt(id));

    if (!post) {
      throw new HttpException('Không tìm thấy bài viết', HttpStatus.NOT_FOUND);
    }

    return {
      message: `Chi tiết bài viết có ID: ${id}`,
      data: post,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    // Chỉ admin mới tạo được bài viết
    const newPost = await this.postsService.create(createPostDto);
    return {
      message: 'Tạo bài viết thành công',
      data: newPost,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    // Chỉ admin mới sửa bài viết
    const updatedPost = await this.postsService.update(
      parseInt(id),
      updatePostDto,
    );

    if (!updatedPost) {
      throw new HttpException(
        'Không tìm thấy bài viết để cập nhật',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: `Cập nhật bài viết ID ${id} thành công`,
      data: updatedPost,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('admin')
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    // Chỉ admin mới xóa bài viết
    const deleted = await this.postsService.remove(parseInt(id));

    if (!deleted) {
      throw new HttpException(
        'Không tìm thấy bài viết để xóa',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: `Xóa bài viết ID ${id} thành công`,
    };
  }
}
