import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
  IsNumber,
  Matches,
} from "class-validator";

export class CreateContactDto {
  // 👤 Personal Info
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;


  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}\s?[A-Z]{2}$/, {
    message: "Invalid postcode format (1234 AB)",
  })
  postcode!: string;

  @IsString()
  @IsNotEmpty()
  straat!: string;

  @IsString()
  @IsNotEmpty()
  nr!: string;



  @IsString()
  @IsNotEmpty()
  plaats!: string;

  // 📐 Project info
  @IsNumber()
  @IsNotEmpty()
  space!: number;

  @IsString()
  @IsNotEmpty()
  message!: string;

  // 🖼️ Images
  @IsArray()
  @IsOptional()
  images?: string[];

  // 📊 System fields
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @IsString()
  @IsOptional()
  status?: string;
}