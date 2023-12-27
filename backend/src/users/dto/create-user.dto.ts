import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: "Name of the user",
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: "Password of the user",
  })
  @IsString()
  password: string;
}
