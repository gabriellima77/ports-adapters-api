import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { LocationModule } from './location/location.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, CompanyModule, LocationModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
