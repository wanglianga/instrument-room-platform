import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PerformancesService } from './performances.service';
import { CreatePerformanceDto } from './dto/create-performance.dto';
import { UpdatePerformanceDto } from './dto/update-performance.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { PerformanceStatus } from './enums/performance.enum';

@Controller('performances')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PerformancesController {
  constructor(private readonly performancesService: PerformancesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createPerformanceDto: CreatePerformanceDto) {
    return this.performancesService.create(createPerformanceDto);
  }

  @Get('my')
  @Roles(UserRole.MANAGER)
  findMyPerformances(
    @GetUser() user,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: PerformanceStatus,
  ) {
    return this.performancesService.findMyPerformances(user.id, +page || 1, +limit || 10, status);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: PerformanceStatus,
    @Query('managerId') managerId?: string,
  ) {
    return this.performancesService.findAll(
      +page || 1,
      +limit || 10,
      status,
      managerId ? +managerId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.performancesService.findOne(+id);
  }

  @Patch(':id/instruments')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  addInstruments(@Param('id') id: string, @Body('instrumentIds') instrumentIds: number[]) {
    return this.performancesService.addInstruments(+id, instrumentIds);
  }

  @Delete(':id/instruments/:instrumentId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  removeInstrument(@Param('id') id: string, @Param('instrumentId') instrumentId: string) {
    return this.performancesService.removeInstrument(+id, +instrumentId);
  }

  @Patch(':id/start-preparation')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  startPreparation(@Param('id') id: string) {
    return this.performancesService.startPreparation(+id);
  }

  @Patch(':id/start')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  startPerformance(@Param('id') id: string) {
    return this.performancesService.startPerformance(+id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  completePerformance(@Param('id') id: string) {
    return this.performancesService.completePerformance(+id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  cancelPerformance(@Param('id') id: string) {
    return this.performancesService.cancelPerformance(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updatePerformanceDto: UpdatePerformanceDto) {
    return this.performancesService.update(+id, updatePerformanceDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.performancesService.remove(+id);
  }
}
