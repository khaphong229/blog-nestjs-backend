import { PartialType } from '@nestjs';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  // PartialType tự động làm tất cả field của CreatePostDto thành optional
  // Rất tiện cho việc update chỉ một phần dữ liệu
}
