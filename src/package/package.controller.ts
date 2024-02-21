import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from 'src/auth/public.decorator';
import { NotFoundException } from '@nestjs/common';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';
@UseGuards(RolesGuard)
@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Roles([UserRights.ADMIN])
  @Post('create')
  async create(@Body() createPackageDto: CreatePackageDto) {
    const pack = await this.packageService.create(createPackageDto);
    return pack;
  }

  @Public()
  @Get()
  findAll(@Query('type') type: string) {
    return this.packageService.findAll(type);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const pack = await this.packageService.findOne(id);
    if (!pack) {
      throw new NotFoundException('Pack not found');
    }
    return pack;
  }

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for package with id:${id}`);
    return this.packageService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for package with id :${id}`);
    return this.packageService.removePermanent(id);
  }
}
