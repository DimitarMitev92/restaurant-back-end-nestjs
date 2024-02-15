import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { NotFoundException } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Post('/create')
  async create(@Body() createLocationDto: CreateLocationDto) {
    const location = await this.locationService.create(createLocationDto);
    return location;
  }

  @Public()
  @Get()
  findAll(@Query('name') name: string) {
    return this.locationService.findAll(name);
  }

  @Public()
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    const location = await this.locationService.findOne(id);
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return location;
  }

  @Public()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Public()
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for location with id:${id}`);
    return this.locationService.removeSoft(id);
  }

  @Public()
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for location with id :${id}`);
    return this.locationService.removePermanent(id);
  }
}
