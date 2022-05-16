import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('resource/:id')
  getResourceById(@Param('id') id: string): Promise<String> {
    return this.appService.getResourceById(id);
  }

  @Get('resource-cache-status/:id')
  getResourceCacheStatus(@Param('id') id: string): { status: string } {
    return this.appService.getResourceCacheStatus(id);
  }
}
