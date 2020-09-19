import { Module } from '@nestjs/common';
import { PuzzleController } from './puzzle.controller';

@Module({
  controllers: [PuzzleController]
})
export class PuzzleModule {}
