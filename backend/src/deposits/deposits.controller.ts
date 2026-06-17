import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DepositsService } from './deposits.service';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { DepositStatus } from './enums/deposit.enum';

@Controller('deposits')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class DepositsController {
  constructor(private readonly depositsService: DepositsService) {}

  @Post()
  create(@Body() createDepositDto: CreateDepositDto, @GetUser() user) {
    return this.depositsService.create(createDepositDto, user.id);
  }

  @Get('my')
  findMyDeposits(
    @GetUser() user,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: DepositStatus,
  ) {
    return this.depositsService.findMyDeposits(user.id, +page || 1, +limit || 10, status);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: DepositStatus,
    @Query('userId') userId?: string,
  ) {
    return this.depositsService.findAll(+page || 1, +limit || 10, status, userId ? +userId : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.depositsService.findOne(+id);
  }

  @Patch(':id/pay')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  confirmPayment(@Param('id') id: string, @GetUser() user) {
    return this.depositsService.confirmPayment(+id, user.id);
  }

  @Patch(':id/refund-request')
  requestRefund(@Param('id') id: string, @GetUser() user) {
    return this.depositsService.requestRefund(+id, user.id);
  }

  @Patch(':id/refund')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  confirmRefund(@Param('id') id: string, @GetUser() user) {
    return this.depositsService.confirmRefund(+id, user.id);
  }

  @Patch(':id/deduct')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  deductDeposit(@Param('id') id: string, @Body('remark') remark: string, @GetUser() user) {
    return this.depositsService.deductDeposit(+id, user.id, remark);
  }

  @Patch(':id/freeze')
  @Roles(UserRole.ADMIN)
  freezeDeposit(@Param('id') id: string, @Body('remark') remark: string, @GetUser() user) {
    return this.depositsService.freezeDeposit(+id, user.id, remark);
  }

  @Patch(':id/unfreeze')
  @Roles(UserRole.ADMIN)
  unfreezeDeposit(@Param('id') id: string, @Body('remark') remark: string, @GetUser() user) {
    return this.depositsService.unfreezeDeposit(+id, user.id, remark);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateDepositDto: UpdateDepositDto) {
    return this.depositsService.update(+id, updateDepositDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.depositsService.remove(+id);
  }
}
