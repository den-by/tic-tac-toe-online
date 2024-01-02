import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: "Name of the user",
    example: "exampleUser",
  })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: "Password of the user",
    example: "strongPassword",
  })
  @IsString()
  password: string;
}
