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
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { NotFoundException } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRights } from 'src/user/entities/user.entity';

@Controller('location')
@UseGuards(RolesGuard)
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // @Roles([UserRights.ADMIN])
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

  @Roles([UserRights.ADMIN])
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return this.locationService.update(id, updateLocationDto);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for location with id:${id}`);
    return this.locationService.removeSoft(id);
  }

  @Roles([UserRights.ADMIN])
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting permanent removal for location with id :${id}`);
    return this.locationService.removePermanent(id);
  }
}
