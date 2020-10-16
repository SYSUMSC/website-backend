import { Injectable } from '@nestjs/common';

@Injectable()
export class RecruitTimelineService {
  private readonly stageTimes = [
    this.getCNTime(new Date(2020, 10, 16)),
    this.getCNTime(new Date(2020, 10, 22)),
    this.getCNTime(new Date(2020, 10, 31)),
    this.getCNTime(new Date(2020, 11, 1))
  ];

  private getCNTime(source: Date) {
    const cnTime = new Date(source.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
    return new Date(source.getTime() + (source.getTime() - cnTime.getTime())).getTime();
  }

  getRecruitProgress() {
    const now = this.getCNTime(new Date());
    for (let i = this.stageTimes.length - 1; i >= 0; i--) {
      if (now >= this.stageTimes[i]) {
        return i;
      }
    }
    return 0;
  }
}
