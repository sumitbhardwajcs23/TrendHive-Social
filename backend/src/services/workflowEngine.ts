export class WorkflowEngine {
  static routePost(post: any, clientTags: string[]) {
    if (clientTags.includes('Healthcare') || clientTags.includes('Financial')) {
      return 'LEGAL_REVIEWER';
    }
    return 'CLIENT_STAKEHOLDER';
  }

  static checkBannedTerms(content: string, bannedTerms: string[]): string[] {
    const foundTerms: string[] = [];
    const lowerContent = content.toLowerCase();
    for (const term of bannedTerms) {
      if (lowerContent.includes(term.toLowerCase())) {
        foundTerms.push(term);
      }
    }
    return foundTerms;
  }
}
