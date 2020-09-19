import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetPuzzleResponse } from './response/get-puzzle.response';

let index = 1;

@Controller('puzzle')
export class PuzzleController {
  @Get()
  @UseGuards(JwtAuthGuard)
  async getPuzzle(): Promise<GetPuzzleResponse> {
    return {
      id: 7,
      title: '管理员令牌 ' + (index++),
      contentHtml: `<p>我也想让你进入下一题，可是我莫得管理员令牌，GG</p>
<p>
  <code>
    select name, role, token from users where role = "student" and name = "\${name}"
  </code>
</p>
<div class="field">
  <label>参数 name</label>
  <input type="text" id="nameparam" class="form-control d-inline mb-2 input-sm" value="you" />
</div>
<button class="btn btn-light float-right" type="button" onclick="myclick()">提交</button>
<p><code id="queryresult"> </code></p>
`,
      script: `function myclick() {
  document.querySelector('#queryresult').innerHTML = 'fuck you';
}`
    };
  }
}
