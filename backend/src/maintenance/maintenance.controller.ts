import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';
import { UpdateMaintenanceRecordDto } from './dto/update-maintenance-record.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { MaintenanceType, MaintenanceStatus } from './enums/maintenance.enum';

@Controller('maintenance')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  create(@Body() createMaintenanceRecordDto: CreateMaintenanceRecordDto) {
    return this.maintenanceService.create(createMaintenanceRecordDto);
  }

  @Get('my')
  @Roles(UserRole.TECHNICIAN)
  findMyMaintenance(
    @GetUser() user,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: MaintenanceStatus,
  ) {
    return this.maintenanceService.findMyMaintenance(user.id, +page || 1, +limit || 10, status);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('type') type?: MaintenanceType,
    @Query('status') status?: MaintenanceStatus,
    @Query('instrumentId') instrumentId?: string,
    @Query('technicianId') technicianId?: string,
  ) {
    return this.maintenanceService.findAll(
      +page || 1,
      +limit || 10,
      type,
      status,
      instrumentId ? +instrumentId : undefined,
      technicianId ? +technicianId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceService.findOne(+id);
  }

  @Patch(':id/start')
  @Roles(UserRole.TECHNICIAN)
  start(@Param('id') id: string, @GetUser() user) {
    return this.maintenanceService.startMaintenance(+id, user.id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.TECHNICIAN)
  complete(
    @Param('id') id: string,
    @Body('result') result: string,
    @Body('cost') cost?: number,
  ) {
    return this.maintenanceService.completeMaintenance(+id, result, cost);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  cancel(@Param('id') id: string) {
    return this.maintenanceService.cancelMaintenance(+id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  update(@Param('id') id: string, @Body() updateMaintenanceRecordDto: UpdateMaintenanceRecordDto) {
    return this.maintenanceService.update(+id, updateMaintenanceRecordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.maintenanceService.remove(+id);
  }
}
