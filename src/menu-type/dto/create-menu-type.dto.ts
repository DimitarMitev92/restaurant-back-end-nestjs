import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMenuTypeDto {
  @IsNotEmpty()
  @IsString()
  type: string;
}
