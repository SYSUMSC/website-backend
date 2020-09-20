import { Module } from '@nestjs/common';
import { PuzzleController } from './puzzle.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './problem.entity';
import { UserAssignedProblemList } from './user-assigned-problem-list.entity';
import { ProblemSelectService } from './problem-select.service';
import { UserSolvePuzzleRecord } from './user-solve-puzzle-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Problem, UserAssignedProblemList, UserSolvePuzzleRecord])],
  controllers: [PuzzleController],
  providers: [ProblemSelectService]
})
export class PuzzleModule {}
