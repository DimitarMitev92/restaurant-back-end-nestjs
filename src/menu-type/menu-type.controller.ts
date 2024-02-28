import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { MenuTypeService } from './menu-type.service';
import { CreateMenuTypeDto } from './dto/create-menu-type.dto';
import { UpdateMenuTypeDto } from './dto/update-menu-type.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRights } from 'src/user/entities/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { Public } from 'src/auth/public.decorator';

@Controller('menu-type')
@UseGuards(RolesGuard)
export class MenuTypeController {
  constructor(private readonly menuTypeService: MenuTypeService) {}

  @Post('create')
  @Roles([UserRights.ADMIN])
  create(@Body() createMenuTypeDto: CreateMenuTypeDto) {
    return this.menuTypeService.create(createMenuTypeDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.menuTypeService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuTypeService.findOne(id);
  }

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMenuTypeDto: UpdateMenuTypeDto,
  ) {
    return this.menuTypeService.update(id, updateMenuTypeDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuTypeService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    return this.menuTypeService.removePermanent(id);
  }
}
