import { Test, TestingModule } from '@nestjs/testing'
import { CaptureService } from './capture.service'

describe('CaptureService', () => {
  let service: CaptureService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CaptureService],
    }).compile()

    service = module.get<CaptureService>(CaptureService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
