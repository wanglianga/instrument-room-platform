import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DisputesService } from './disputes.service';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { UpdateDisputeDto } from './dto/update-dispute.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { DisputeStatus, PerformanceImpact } from './enums/dispute.enum';

@Controller('disputes')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DisputesController {
  constructor(private readonly disputesService: DisputesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createDisputeDto: CreateDisputeDto, @GetUser() user) {
    return this.disputesService.create(createDisputeDto, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER, UserRole.TECHNICIAN)
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: DisputeStatus,
    @Query('instrumentId') instrumentId?: string,
  ) {
    return this.disputesService.findAll(
      +page || 1,
      +limit || 10,
      status,
      instrumentId ? +instrumentId : undefined,
    );
  }

  @Get('reservation/:reservationId')
  findByReservationId(@Param('reservationId') reservationId: string) {
    return this.disputesService.findByReservationId(+reservationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disputesService.findOne(+id);
  }

  @Patch(':id/teacher-review')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  teacherReview(
    @Param('id') id: string,
    @Body('performanceImpact') performanceImpact: PerformanceImpact,
    @Body('comment') comment: string,
    @GetUser() user,
  ) {
    return this.disputesService.teacherReview(+id, user.id, performanceImpact, comment);
  }

  @Patch(':id/technician-quote')
  @Roles(UserRole.TECHNICIAN, UserRole.ADMIN)
  technicianQuote(
    @Param('id') id: string,
    @Body('repairQuote') repairQuote: number,
    @Body('comment') comment: string,
    @GetUser() user,
  ) {
    return this.disputesService.technicianQuote(+id, user.id, repairQuote, comment);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.ADMIN)
  resolve(
    @Param('id') id: string,
    @Body('deductedAmount') deductedAmount: number,
    @Body('resolutionNote') resolutionNote: string,
  ) {
    return this.disputesService.resolve(+id, deductedAmount, resolutionNote);
  }

  @Patch(':id/close')
  @Roles(UserRole.ADMIN)
  close(@Param('id') id: string) {
    return this.disputesService.close(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDisputeDto: UpdateDisputeDto) {
    return this.disputesService.update(+id, updateDisputeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.disputesService.remove(+id);
  }
}
