import { Injectable } from '@nestjs/common';

export interface RatingCounts {
  surveysSent: number;
  surveysAnswered: number;
  surveysUnanswered: number;
  ratingGreat: number;
  ratingGood: number;
  ratingRegular: number;
  ratingBad: number;
}

export interface MetricsResult {
  responseRate: number;
  satisfactionIndex: number;
  pctPositive: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

@Injectable()
export class MetricsService {
  calculate(counts: RatingCounts): MetricsResult {
    const { surveysSent, surveysAnswered, ratingGreat, ratingGood, ratingRegular, ratingBad } =
      counts;

    const responseRate = surveysSent > 0 ? (surveysAnswered / surveysSent) * 100 : 0;

    const satisfactionIndex =
      surveysAnswered > 0
        ? ((ratingGreat * 4 + ratingGood * 3 + ratingRegular * 2 + ratingBad * 1) /
            (surveysAnswered * 4)) *
          100
        : 0;

    const pctPositive =
      surveysAnswered > 0 ? ((ratingGreat + ratingGood) / surveysAnswered) * 100 : 0;

    return {
      responseRate: round2(responseRate),
      satisfactionIndex: round2(satisfactionIndex),
      pctPositive: round2(pctPositive),
    };
  }
}
