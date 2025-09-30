import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/posts/post.entity';
import { RolesGuard } from 'src/auth/roles.guard';
import { Tag } from 'src/tags/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Tag])],
  controllers: [PostsController],
  providers: [PostsService, RolesGuard],
})
export class PostsModule {}
