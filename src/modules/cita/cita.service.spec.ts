import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CitaService } from './cita.service';
import { Cita } from './schema/cita.schema';

describe('CitaService', () => {
  let service: CitaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitaService,
        {
          provide: getModelToken(Cita.name),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CitaService>(CitaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});