import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
