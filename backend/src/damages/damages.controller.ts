import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DamagesService } from './damages.service';
import { CreateDamageRecordDto } from './dto/create-damage-record.dto';
import { UpdateDamageRecordDto } from './dto/update-damage-record.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { DamageStatus } from './enums/damage.enum';

@Controller('damages')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DamagesController {
  constructor(private readonly damagesService: DamagesService) {}

  @Post()
  create(@Body() createDamageRecordDto: CreateDamageRecordDto, @GetUser() user) {
    return this.damagesService.create(createDamageRecordDto, user.id);
  }

  @Get('my')
  findMyDamages(
    @GetUser() user,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: DamageStatus,
  ) {
    return this.damagesService.findMyDamages(user.id, +page || 1, +limit || 10, status);
  }

  @Get()
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: DamageStatus,
    @Query('instrumentId') instrumentId?: string,
    @Query('responsibleUserId') responsibleUserId?: string,
  ) {
    return this.damagesService.findAll(
      +page || 1,
      +limit || 10,
      status,
      instrumentId ? +instrumentId : undefined,
      responsibleUserId ? +responsibleUserId : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.damagesService.findOne(+id);
  }

  @Patch(':id/assess')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  assess(
    @Param('id') id: string,
    @Body('compensationAmount') compensationAmount: number,
    @Body('assessNotes') assessNotes: string,
    @GetUser() user,
  ) {
    return this.damagesService.assess(+id, user.id, compensationAmount, assessNotes);
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  confirmPayment(@Param('id') id: string, @GetUser() user) {
    return this.damagesService.confirmPayment(+id, user.id);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
  resolve(
    @Param('id') id: string,
    @Body('resolutionNotes') resolutionNotes: string,
    @GetUser() user,
  ) {
    return this.damagesService.resolve(+id, user.id, resolutionNotes);
  }

  @Patch(':id/close')
  @Roles(UserRole.ADMIN)
  close(@Param('id') id: string, @GetUser() user) {
    return this.damagesService.close(+id, user.id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDamageRecordDto: UpdateDamageRecordDto) {
    return this.damagesService.update(+id, updateDamageRecordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.damagesService.remove(+id);
  }
}
