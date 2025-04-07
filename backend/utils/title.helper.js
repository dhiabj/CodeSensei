function generateTitle(analysis) {
  try {
    const issuesSection = analysis.split('🔍 Issues')[1] || analysis;
    const firstIssue = issuesSection
      .split('\n')
      .find((line) => line.trim().match(/^[-*]/));

    if (!firstIssue) return 'Code Review Analysis';

    return firstIssue
      .replace(/^[-*]\s*/, '')
      .split(/[,.:]/)[0]
      .trim()
      .split(' ')
      .slice(0, 3)
      .join(' ');
  } catch (e) {
    return 'Code Review Analysis';
  }
}

module.exports = { generateTitle };
