import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class CreateUserResponseDto {
  @ApiProperty({ example: "1", description: "The id of the User" })
  @Expose()
  @IsString()
  token: string;
}
