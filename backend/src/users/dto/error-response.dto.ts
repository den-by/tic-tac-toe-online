import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDto {
  @ApiProperty({
    description: "Error message",
    example: "Something wen wrong",
  })
  message: string;

  @ApiProperty({
    description: "Status code",
    example: 409,
  })
  status: number;

  @ApiProperty({
    description: "Error type",
    example: "Conflict",
  })
  error: string;
}
