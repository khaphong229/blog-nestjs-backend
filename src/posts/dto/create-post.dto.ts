import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(5, { message: 'Tiêu đề phải có ít nhất 5 ký tự' })
  @MaxLength(200, { message: 'Tiêu đề không được quá 200 ký tự' })
  title: string;

  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @MinLength(10, { message: 'Nội dung phải có ít nhất 10 ký tự' })
  content: string;

  @IsOptional()
  @IsString({ message: 'Tác giả phải là chuỗi ký tự' })
  author?: string;

  @IsOptional()
  @IsArray({ message: 'Tags phải là mảng' })
  @IsString({ each: true, message: 'Mỗi tag phải là chuỗi ký tự' })
  tags?: string[];
}
