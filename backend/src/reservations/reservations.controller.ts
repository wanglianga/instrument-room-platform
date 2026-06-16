import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { ReservationStatus } from './enums/reservation.enum';

@Controller('reservations')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto, @GetUser() user) {
    return this.reservationsService.create(createReservationDto, user.id);
  }

  @Get('my')
  findMyReservations(
    @GetUser() user,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: ReservationStatus,
  ) {
    return this.reservationsService.findMyReservations(user.id, +page || 1, +limit || 10, status);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: ReservationStatus,
    @Query('userId') userId?: string,
  ) {
    return this.reservationsService.findAll(+page || 1, +limit || 10, status, userId ? +userId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  approve(@Param('id') id: string, @GetUser() user) {
    return this.reservationsService.approve(+id, user.id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  reject(@Param('id') id: string, @Body('reason') reason: string, @GetUser() user) {
    return this.reservationsService.reject(+id, user.id, reason);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @GetUser() user) {
    return this.reservationsService.cancel(+id, user.id);
  }

  @Patch(':id/borrow')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.OK)
  confirmBorrow(@Param('id') id: string) {
    return this.reservationsService.confirmBorrow(+id);
  }

  @Patch(':id/return')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  @HttpCode(HttpStatus.OK)
  confirmReturn(@Param('id') id: string) {
    return this.reservationsService.confirmReturn(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
