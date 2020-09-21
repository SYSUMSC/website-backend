import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Param,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from './problem.entity';
import { Repository } from 'typeorm';
import { UserAssignedProblemList } from './user-assigned-problem-list.entity';
import { GetProblemListResponse } from './response/get-problem-list.response';
import { ProblemSelectService } from './problem-select.service';
import { UserSolvePuzzleRecord } from './user-solve-puzzle-record.entity';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitAnswerResponse } from './response/submit-answer.response';

@Controller('puzzle')
export class PuzzleController {
  constructor(
    @InjectRepository(Problem) private readonly problemRepository: Repository<Problem>,
    @InjectRepository(UserAssignedProblemList)
    private readonly userAssignedProblemListRepository: Repository<UserAssignedProblemList>,
    @InjectRepository(UserSolvePuzzleRecord)
    private readonly userSolvePuzzleRecordRepository: Repository<UserSolvePuzzleRecord>,
    private readonly problemSelectService: ProblemSelectService
  ) {}

  @Get('problem')
  @UseGuards(JwtAuthGuard)
  async getPuzzleProblems(@Request() request): Promise<GetProblemListResponse> {
    let list = await this.userAssignedProblemListRepository.findOne({ user_id: request.user.id });
    if (!list) {
      const allProblems = await this.problemRepository.find();
      const selectedProblems = this.problemSelectService.selectProblemsRandomly(allProblems);
      await this.userAssignedProblemListRepository.insert({
        user_id: request.user.id,
        problem_ids: selectedProblems.map(p => `${p.id}`)
      });
      list = await this.userAssignedProblemListRepository.findOne({ user_id: request.user.id });
    }
    const problems = await this.problemRepository
      .createQueryBuilder('problem')
      .where('problem.id IN (:...ids)', { ids: list.problem_ids })
      .execute();
    const passed = await Promise.all(
      problems.map(p =>
        this.userSolvePuzzleRecordRepository
          .findOne({
            passed: true,
            problem_id: p.problem_id,
            user_id: request.user.id
          })
          .then(result => !!result)
      )
    );
    const count = await this.userSolvePuzzleRecordRepository.count();
    return {
      submissionsCount: count,
      problems: problems.map((p, index) => ({
        id: p.problem_id,
        title: p.problem_title,
        level: p.problem_level,
        passed: passed[index]
      }))
    };
  }

  @Get('problem/:id')
  @UseGuards(JwtAuthGuard)
  async getProblem(@Request() request, @Param() params) {
    const problem = await this.problemRepository.findOne({ id: params.id });
    if (!problem) {
      throw new HttpException(`ID为${params.id}的谜题不存在`, 404);
    }
    const list = await this.userAssignedProblemListRepository.findOne({ user_id: request.user.id });
    if (list.problem_ids.indexOf(`${problem.id}`) === -1) {
      throw new HttpException('你没有权限访问这道谜题', 401);
    }
    return problem;
  }

  @Post('problem/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async submitAnswer(
    @Request() request,
    @Body() dto: SubmitAnswerDto,
    @Param() params
  ): Promise<SubmitAnswerResponse> {
    const problem = await this.problemRepository.findOne({ id: params.id });
    if (!problem) {
      throw new HttpException(`ID为${params.id}的谜题不存在`, 404);
    }
    const passed = problem.answer === dto.answer;
    await this.userSolvePuzzleRecordRepository.insert({
      time: new Date(),
      problem_id: problem.id,
      user_id: request.user.id,
      passed,
      answer: dto.answer
    });
    if (!passed) {
      throw new HttpException('答案不正确', 403);
    }
    return { passed };
  }

  @Post('problem/:id/internal')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async callProblemServerSideScript(@Body() body: { param: any }, @Param() params) {
    const problem = await this.problemRepository.findOne({ id: params.id });
    if (!problem) {
      throw new HttpException(`ID为${params.id}的谜题不存在`, 404);
    }
    if (!problem.server_side_script) {
      throw new HttpException(`ID为${params.id}的谜题的内部脚本不存在`, 404);
    }
    let result;
    try {
      const script = `(function(){var r;(function(__p,__s){${
        problem.server_side_script
      };__s(run(__p));})(${JSON.stringify(body.param)},v=>r=v);return r;})();`;
      result = eval(script);
    } catch (e) {
      console.log(e);
      throw new HttpException('谜题内部脚本执行出错', 500);
    }
    return result;
  }
}
