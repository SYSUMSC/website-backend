import { ProblemLevel } from '../problem.entity';

export class GetProblemListResponse {
  submissionsCount: number;
  problems: {
    id: number;
    title: string;
    level: ProblemLevel;
    passed: boolean;
  }[];
}
