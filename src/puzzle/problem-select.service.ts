import { Injectable } from '@nestjs/common';
import {
  Problem,
  PROBLEM_LEVEL_HIGH,
  PROBLEM_LEVEL_LOW,
  PROBLEM_LEVEL_MEDIUM
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

  selectProblemsRandomly(allProblems: Problem[]): Problem[] {
    const lowLevelProblems = allProblems.filter(p => p.level === PROBLEM_LEVEL_LOW);
    const mediumLevelProblems = allProblems.filter(p => p.level === PROBLEM_LEVEL_MEDIUM);
    const highLevelProblems = allProblems.filter(p => p.level === PROBLEM_LEVEL_HIGH);
    return [
      ...this.pickRandomly(lowLevelProblems, this.lowLevelCount),
      ...this.pickRandomly(mediumLevelProblems, this.mediumLevelCount),
      ...this.pickRandomly(highLevelProblems, this.highLevelCount)
    ].sort(() => Math.random() - 0.5); // shuffle
  }

  private pickRandomly<T>(list: T[], count: number) {
    const result = [];
    while (result.length < count) {
      const item = list[Math.floor(Math.random() * list.length)];
      result.push(item);
      list = [...list.filter(it => it === item)];
    }
    return result;
  }
}
