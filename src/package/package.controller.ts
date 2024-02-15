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
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Public } from 'src/auth/public.decorator';
import { NotFoundException } from '@nestjs/common';
@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Public()
  @Post('/create')
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
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const pack = await this.packageService.findOne(id);
    if (!pack) {
      throw new NotFoundException('Pack not found');
    }
    return pack;
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.packageService.update(id, updatePackageDto);
  }

  @Public()
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for package with id:${id}`);
    return this.packageService.removeSoft(id);
  }

  @Public()
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for package with id :${id}`);
    return this.packageService.removePermanent(id);
  }
}
