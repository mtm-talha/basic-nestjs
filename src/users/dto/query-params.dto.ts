import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

enum OrderType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryParamsDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ name: 'page', required: false, type: String })
  @Type(() => Number)
  readonly page?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ name: 'limit', required: false, type: Number })
  @Type(() => Number)
  readonly limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ name: 'offset', required: false, type: String })
  @Type(() => String)
  readonly offset?: string;

  @IsEnum(OrderType)
  @IsOptional()
  @ApiProperty({
    name: 'order',
    enum: OrderType,
    required: false,
    type: String,
    description: 'Order by user name',
  })
  @Type(() => String)
  readonly order?: OrderType;

  // @IsObject()
  // @IsOptional()
  // @ApiProperty({ name: 'where', required: false, type: Object })
  @IsObject()
  @IsOptional()
  @ApiProperty({
    name: 'where',
    required: false,
    type: Object,
    example: { age: 18 },
    description: 'Filter criteria. Use format: where[field]=value',
  })
  @Type(() => Object)
  readonly where?: object;
}
