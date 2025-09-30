import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  findOne(id: number): Promise<Post | null> {
    return this.postsRepository.findOneBy({ id });
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    let tags: Tag[] = [];
    if (createPostDto.tags && createPostDto.tags.length > 0) {
      tags = await Promise.all(
        createPostDto.tags.map(async (tagName) => {
          let tag = await this.tagsRepository.findOne({
            where: { name: tagName },
          });
          if (!tag) {
            tag = this.tagsRepository.create({ name: tagName });
            await this.tagsRepository.save(tag);
          }
          return tag;
        }),
      );
    }
    const post = this.postsRepository.create({
      ...createPostDto,
      tags,
    });
    return this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['tags'],
    });
    if (!post) return null;

    if (updatePostDto.tags) {
      post.tags = await Promise.all(
        updatePostDto.tags.map(async (tagName) => {
          let tag = await this.tagsRepository.findOne({
            where: { name: tagName },
          });
          if (!tag) {
            tag = this.tagsRepository.create({ name: tagName });
            await this.tagsRepository.save(tag);
          }
          return tag;
        }),
      );
    }

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
