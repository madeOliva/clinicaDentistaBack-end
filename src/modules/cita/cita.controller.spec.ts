import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CitaController } from './cita.controller';
import { CitaService } from './cita.service';
import { Cita } from './schema/cita.schema';

describe('CitaController', () => {
  let controller: CitaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitaController],
      providers: [
        CitaService,
        {
          provide: getModelToken(Cita.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CitaController>(CitaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});