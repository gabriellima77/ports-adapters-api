import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { CompanyModule } from './modules/company/company.module';
import { LocationModule } from './modules/location/location.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, CompanyModule, LocationModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
