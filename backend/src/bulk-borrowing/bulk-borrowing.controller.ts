import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BulkBorrowingService } from './bulk-borrowing.service';
import { CreateBulkBorrowingDto } from './dto/create-bulk-borrowing.dto';
import { UpdateBulkBorrowingDto } from './dto/update-bulk-borrowing.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/enums/user-role.enum';
import { BulkBorrowingStatus } from './enums/bulk-borrowing.enum';

@Controller('bulk-borrowings')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BulkBorrowingController {
  constructor(private readonly bulkBorrowingService: BulkBorrowingService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  create(@Body() createDto: CreateBulkBorrowingDto, @GetUser() user) {
    return this.bulkBorrowingService.create(createDto, user.id);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.TEACHER)
  findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status?: BulkBorrowingStatus,
  ) {
    return this.bulkBorrowingService.findAll(+page || 1, +limit || 10, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bulkBorrowingService.findOne(+id);
  }

  @Get(':id/conflicts')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  detectConflicts(@Param('id') id: string) {
    return this.bulkBorrowingService.detectConflicts(+id);
  }

  @Patch(':id/submit')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  submitForApproval(@Param('id') id: string) {
    return this.bulkBorrowingService.submitForApproval(+id);
  }

  @Patch(':id/approve')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  approve(@Param('id') id: string, @GetUser() user) {
    return this.bulkBorrowingService.approve(+id, user.id);
  }

  @Patch(':id/reject')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  reject(@Param('id') id: string, @Body('reason') reason: string, @GetUser() user) {
    return this.bulkBorrowingService.reject(+id, user.id, reason);
  }

  @Patch(':id/lock')
  @Roles(UserRole.ADMIN)
  lock(@Param('id') id: string) {
    return this.bulkBorrowingService.lock(+id);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  complete(@Param('id') id: string) {
    return this.bulkBorrowingService.complete(+id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  cancel(@Param('id') id: string) {
    return this.bulkBorrowingService.cancel(+id);
  }

  @Post(':id/items')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  addItems(@Param('id') id: string, @Body('items') items: any[]) {
    return this.bulkBorrowingService.addItems(+id, items);
  }

  @Delete(':id/items/:itemId')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.bulkBorrowingService.removeItem(+id, +itemId);
  }

  @Patch('conflicts/:conflictId/resolve')
  @Roles(UserRole.ADMIN)
  resolveConflict(@Param('conflictId') conflictId: string) {
    return this.bulkBorrowingService.resolveConflict(+conflictId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  update(@Param('id') id: string, @Body() updateDto: UpdateBulkBorrowingDto) {
    return this.bulkBorrowingService.update(+id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.bulkBorrowingService.remove(+id);
  }
}
