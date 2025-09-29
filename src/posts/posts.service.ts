import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post | null> {
    return this.postsRepository.findOneBy({ id });
  }

  create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const post = await this.postsRepository.findOneBy({ id });
    if (!post) return null;
    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.postsRepository.delete(id);
    return result.affected > 0;
  }

  findByTag(tag: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: {
        tags: Like(`%${tag}%`),
      },
    });
  }
}
