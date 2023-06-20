import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { useContainer } from 'class-validator';
import * as session from 'express-session';
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  console.log(configService.get('MONGO_URL'));
  app.useGlobalPipes(new ValidationPipe());

const options = new DocumentBuilder()
.setTitle('API SM')
.setDescription(' API documentation SM')
.setVersion('Alpha') 
.addBearerAuth(undefined, 'defaultBearerAuth')
.build() 
useContainer(app.select(AppModule), { fallbackOnErrors: true });
const document = SwaggerModule.createDocument(app, options)
SwaggerModule.setup('api', app, document, {
customSiteTitle: 'API Tset SM',
})
  const port = configService.get('PORT');
  await app.listen(port);
  
  
  console.log('\x1b[42m%s\x1b[0m',"http://localhost:" + port + "/api");
  
}
bootstrap();
