import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cliente, ClienteSchema } from './schema/cliente.schema';

@Module({
  controllers: [ClienteController],
  providers: [ClienteService],

  imports: [MongooseModule.forFeature([{
    name: Cliente.name,
    schema: ClienteSchema,
  },]),],
  exports: [MongooseModule],

})
export class ClienteModule { }