import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TitleGeneratorHelper {
  private readonly logger = new Logger(TitleGeneratorHelper.name);

  private readonly DEFAULT_TITLE = 'Code Review Analysis';
  private readonly ISSUES_HEADER = '🔍 Issues';

  generateTitle(analysis: string): string {
    if (typeof analysis !== 'string' || !analysis.trim()) {
      return this.DEFAULT_TITLE;
    }

    try {
      const issuesSection = analysis.split(this.ISSUES_HEADER)[1] ?? analysis;

      const firstIssueLine = issuesSection
        .split('\n')
        .find((line) => line.trim().match(/^[-*]\s/));

      if (!firstIssueLine) return this.DEFAULT_TITLE;

      const issueText = firstIssueLine
        .replace(/^[-*]\s*/, '')
        .split(/[,.:]/)[0]
        .trim();

      const meaningfulWords = issueText
        .split(' ')
        .filter((word) => word.length > 3)
        .slice(0, 4);

      return meaningfulWords.join(' ') || this.DEFAULT_TITLE;
    } catch (error) {
      this.logger.error('Title generation failed', error);
      return this.DEFAULT_TITLE;
    }
  }
}
