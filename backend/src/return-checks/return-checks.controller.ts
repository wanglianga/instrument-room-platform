import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReturnChecksService } from './return-checks.service';
import { CreateReturnCheckDto } from './dto/create-return-check.dto';
import { UpdateReturnCheckDto } from './dto/update-return-check.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('return-checks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReturnChecksController {
  constructor(private readonly returnChecksService: ReturnChecksService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.TECHNICIAN)
  create(@Body() createReturnCheckDto: CreateReturnCheckDto, @GetUser() user) {
    return this.returnChecksService.create(createReturnCheckDto, user.id);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('instrumentId') instrumentId?: string,
    @Query('reservationId') reservationId?: string,
  ) {
    return this.returnChecksService.findAll(
      +page || 1,
      +limit || 10,
      instrumentId ? +instrumentId : undefined,
      reservationId ? +reservationId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnChecksService.findOne(+id);
  }

  @Get('reservation/:reservationId')
  findByReservationId(@Param('reservationId') reservationId: string) {
    return this.returnChecksService.findByReservationId(+reservationId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  update(@Param('id') id: string, @Body() updateReturnCheckDto: UpdateReturnCheckDto) {
    return this.returnChecksService.update(+id, updateReturnCheckDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.returnChecksService.remove(+id);
  }
}
