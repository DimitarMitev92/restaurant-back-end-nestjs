import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PackegeService } from './packege.service';
import { CreatePackegeDto } from './dto/create-packege.dto';
import { UpdatePackegeDto } from './dto/update-packege.dto';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';
import { Public } from 'src/auth/public.decorator';

@Controller('packege')
export class PackegeController {
  constructor(private readonly packegeService: PackegeService) {}

  @Roles([UserRights.ADMIN])
  @Post()
  create(@Body() createPackegeDto: CreatePackegeDto) {
    return this.packegeService.create(createPackegeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.packegeService.findAll();
  }

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePackegeDto: UpdatePackegeDto,
  ) {
    return this.packegeService.update(id, updatePackegeDto);
  }
  @Roles([UserRights.ADMIN])
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.packegeService.remove(id);
  }
}
