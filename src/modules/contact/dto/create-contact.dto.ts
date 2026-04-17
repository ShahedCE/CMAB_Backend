import { IsEmail, IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(190)
  @IsString()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(5000)
  message!: string;
}
