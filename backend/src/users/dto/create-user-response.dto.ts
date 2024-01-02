import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { IsString } from "class-validator";

export class CreateUserResponseDto {
  @ApiProperty({
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwNSIsInVzZXJuYW1lIjoic2Z0cmVlZWZnZ2dlZ3NkZmRmZmZkZ2dmZmluZ2YiLCJpYXQiOjE3MDQxOTAxOTAsImV4cCI6MTcwNDI3NjU5MH0.BOq4w5vwSo5DAsmoGAC0kh0vveTGsdMYZLZbiPGea0g",
    description: "JWT token",
  })
  @Expose()
  @IsString()
  token: string;
}
