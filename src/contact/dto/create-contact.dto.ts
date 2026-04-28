import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  space!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  houseNumber!: string;
  @IsBoolean()
  @IsNotEmpty()
  isRead!: string;
  @IsString()
  @IsNotEmpty()
  message!: string;
  @IsString()
  @IsNotEmpty()
  status!: string;
  @IsArray()
  @IsOptional()
  images?: string[];
}
