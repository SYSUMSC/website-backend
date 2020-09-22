import { Injectable } from '@nestjs/common';
import {
  Problem,
  PROBLEM_LEVEL_HIGH,
  PROBLEM_LEVEL_LOW,
  PROBLEM_LEVEL_MEDIUM,
  PROBLEM_LEVEL_NULL
} from './problem.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProblemSelectService {
  private readonly lowLevelCount;
  private readonly mediumLevelCount;
  private readonly highLevelCount;

  constructor(configService: ConfigService) {
    this.lowLevelCount = Number(configService.get('PROBLEM_SELECT_LOW_LEVEL_COUNT'));
    this.mediumLevelCount = Number(configService.get('PROBLEM_SELECT_MEDIUM_LEVEL_COUNT'));
    this.highLevelCount = Number(configService.get('PROBLEM_SELECT_HIGH_LEVEL_COUNT'));
  }

  selectProblemsRandomly(problems: Problem[]): Problem[] {
    const nullLevelProblems = problems.filter(p => p.level === PROBLEM_LEVEL_NULL);
    const lowLevelProblems = problems.filter(p => p.level === PROBLEM_LEVEL_LOW);
    const mediumLevelProblems = problems.filter(p => p.level === PROBLEM_LEVEL_MEDIUM);
    const highLevelProblems = problems.filter(p => p.level === PROBLEM_LEVEL_HIGH);
    return [
      ...nullLevelProblems,
      ...this.pickRandomly(lowLevelProblems, this.lowLevelCount),
      ...this.pickRandomly(mediumLevelProblems, this.mediumLevelCount),
      ...this.pickRandomly(highLevelProblems, this.highLevelCount)
    ];
  }

  private pickRandomly<T>(list: T[], count: number) {
    const result = [];
    while (result.length < count) {
      const item = list[Math.floor(Math.random() * list.length)];
      result.push(item);
      list = [...list.filter(it => it !== item)];
    }
    return result;
  }
}
