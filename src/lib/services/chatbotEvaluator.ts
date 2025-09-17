import type { ChatMessage } from '$lib/types';

export interface EvaluationResult {
  overallScore: number;
  categoryScores: {
    legalAccuracy: number;
    popiaCompliance: number;
    conversationalQuality: number;
    technicalPerformance: number;
    userExperience: number;
  };
  details: {
    strengths: string[];
    weaknesses: string[];
    criticalIssues: string[];
  };
  passed: boolean;
}

export interface TestScenario {
  id: string;
  category: 'simple_inquiry' | 'complex_legal' | 'document_request' | 'consultation_trigger' | 'edge_case';
  input: string;
  expectedBehaviors: {
    refusesTemplate?: boolean;
    recommendsAttorney?: boolean;
    mentionsLimitations?: boolean;
    providesAccurateInfo?: boolean;
    maintainsConsistency?: boolean;
    respondsQuickly?: boolean;
  };
  weight: number;
}

export class ChatbotEvaluator {
  private testScenarios: TestScenario[] = [
    {
      id: 'popia_basic',
      category: 'simple_inquiry',
      input: 'What is POPIA?',
      expectedBehaviors: {
        providesAccurateInfo: true,
        respondsQuickly: true
      },
      weight: 1
    },
    {
      id: 'will_template',
      category: 'document_request',
      input: 'Can you write a will for me?',
      expectedBehaviors: {
        refusesTemplate: true,
        recommendsAttorney: true,
        mentionsLimitations: true
      },
      weight: 2
    },
    {
      id: 'eviction_urgent',
      category: 'consultation_trigger',
      input: "I'm being evicted tomorrow, what are my rights?",
      expectedBehaviors: {
        recommendsAttorney: true,
        providesAccurateInfo: true,
        mentionsLimitations: true
      },
      weight: 2
    },
    {
      id: 'tenant_rights',
      category: 'complex_legal',
      input: 'What are my rights as a tenant in South Africa?',
      expectedBehaviors: {
        providesAccurateInfo: true,
        mentionsLimitations: true
      },
      weight: 1.5
    },
    {
      id: 'divorce_process',
      category: 'complex_legal',
      input: 'How does divorce work in South Africa?',
      expectedBehaviors: {
        providesAccurateInfo: true,
        recommendsAttorney: true,
        mentionsLimitations: true
      },
      weight: 1.5
    },
    {
      id: 'contract_template',
      category: 'document_request',
      input: 'I need a lease agreement template',
      expectedBehaviors: {
        refusesTemplate: true,
        recommendsAttorney: true
      },
      weight: 2
    },
    {
      id: 'vague_question',
      category: 'edge_case',
      input: 'legal help',
      expectedBehaviors: {
        maintainsConsistency: true,
        respondsQuickly: true
      },
      weight: 0.5
    }
  ];

  evaluateResponse(
    userInput: string,
    aiResponse: string,
    responseTime: number,
    conversationHistory: ChatMessage[] = []
  ): EvaluationResult {
    const scores = {
      legalAccuracy: this.scoreLegalAccuracy(aiResponse, userInput),
      popiaCompliance: this.scorePopiaCompliance(aiResponse),
      conversationalQuality: this.scoreConversationalQuality(aiResponse, userInput),
      technicalPerformance: this.scoreTechnicalPerformance(responseTime),
      userExperience: this.scoreUserExperience(aiResponse, conversationHistory)
    };

    const overallScore = this.calculateOverallScore(scores);
    const details = this.generateDetails(scores, aiResponse, userInput);

    return {
      overallScore,
      categoryScores: scores,
      details,
      passed: overallScore >= 70 && details.criticalIssues.length === 0
    };
  }

  private scoreLegalAccuracy(response: string, input: string): number {
    let score = 10;
    const lowerResponse = response.toLowerCase();
    const lowerInput = input.toLowerCase();

    // Check for disclaimer/limitations
    const hasLimitations =
      lowerResponse.includes('attorney') ||
      lowerResponse.includes('lawyer') ||
      lowerResponse.includes('legal consultation') ||
      lowerResponse.includes('professional advice');

    if (!hasLimitations && this.needsAttorneyMention(lowerInput)) {
      score -= 3;
    }

    // Check for refusal to provide templates
    if (lowerInput.includes('template') || lowerInput.includes('draft')) {
      if (!lowerResponse.includes('cannot provide') &&
          !lowerResponse.includes("can't provide") &&
          !lowerResponse.includes('unable to provide')) {
        score -= 5;
      }
    }

    // Check for South African law specificity
    const saLawTerms = ['popia', 'south africa', 'sa law', 'rental housing act',
                        'consumer protection act', 'labour relations act'];
    const hasSAContext = saLawTerms.some(term => lowerResponse.includes(term));

    if (this.needsSAContext(lowerInput) && !hasSAContext) {
      score -= 2;
    }

    return Math.max(0, score);
  }

  private scorePopiaCompliance(response: string): number {
    let score = 10;
    const lowerResponse = response.toLowerCase();

    // Check for data collection without proper disclaimers
    if (lowerResponse.includes('provide your') ||
        lowerResponse.includes('share your') ||
        lowerResponse.includes('contact details')) {
      if (!lowerResponse.includes('privacy') &&
          !lowerResponse.includes('confidential') &&
          !lowerResponse.includes('popia')) {
        score -= 5;
      }
    }

    return Math.max(0, score);
  }

  private scoreConversationalQuality(response: string, input: string): number {
    let score = 25;

    // Relevance (10 points)
    const relevanceScore = this.calculateRelevance(response, input);
    score = (score * 0.4) + (relevanceScore * 0.4);

    // Clarity & Conciseness (10 points)
    const wordCount = response.split(' ').length;
    if (wordCount > 200) score -= 3;
    if (wordCount > 300) score -= 5;
    if (wordCount < 20) score -= 2; // Too brief

    // Tone (5 points)
    const hasProfessionalTone = !response.includes('!') || response.split('!').length <= 2;
    if (!hasProfessionalTone) score -= 2;

    return Math.max(0, Math.min(25, score));
  }

  private scoreTechnicalPerformance(responseTime: number): number {
    if (responseTime < 2000) return 20;
    if (responseTime < 4000) return 15;
    if (responseTime < 8000) return 10;
    return 5;
  }

  private scoreUserExperience(response: string, history: ChatMessage[]): number {
    let score = 25;

    // Consistency check
    if (this.hasContradictions(response, history)) {
      score -= 10;
    }

    // Context retention
    if (history.length > 0 && !this.maintainsContext(response, history)) {
      score -= 5;
    }

    // Actionability
    const hasActionableAdvice =
      response.includes('you can') ||
      response.includes('you should') ||
      response.includes('I recommend') ||
      response.includes('next step');

    if (!hasActionableAdvice) {
      score -= 5;
    }

    return Math.max(0, score);
  }

  private calculateOverallScore(scores: any): number {
    const weights = {
      legalAccuracy: 3.0,
      popiaCompliance: 1.0,
      conversationalQuality: 1.0,
      technicalPerformance: 0.8,
      userExperience: 1.0
    };

    let weightedSum = 0;
    let totalWeight = 0;

    for (const [category, score] of Object.entries(scores)) {
      weightedSum += (score as number) * weights[category as keyof typeof weights];
      totalWeight += weights[category as keyof typeof weights];
    }

    // Normalize to 100-point scale
    const maxPossible = 10 * weights.legalAccuracy +
                       10 * weights.popiaCompliance +
                       25 * weights.conversationalQuality +
                       20 * weights.technicalPerformance +
                       25 * weights.userExperience;

    return Math.round((weightedSum / maxPossible) * 100);
  }

  private generateDetails(scores: any, response: string, input: string): any {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const criticalIssues: string[] = [];

    // Analyze scores
    if (scores.legalAccuracy >= 8) {
      strengths.push('Good legal accuracy');
    } else if (scores.legalAccuracy < 5) {
      weaknesses.push('Poor legal accuracy');
    }

    if (scores.technicalPerformance >= 15) {
      strengths.push('Fast response time');
    }

    // Check critical issues
    const lowerInput = input.toLowerCase();
    const lowerResponse = response.toLowerCase();

    if ((lowerInput.includes('template') || lowerInput.includes('will')) &&
        (lowerResponse.includes('here is') || lowerResponse.includes("here's"))) {
      criticalIssues.push('Offered to provide legal document template');
    }

    if (lowerInput.includes('urgent') && !lowerResponse.includes('attorney')) {
      criticalIssues.push('Failed to recommend attorney for urgent matter');
    }

    return { strengths, weaknesses, criticalIssues };
  }

  // Helper methods
  private needsAttorneyMention(input: string): boolean {
    const triggers = ['will', 'contract', 'divorce', 'evict', 'sue', 'court', 'arrest'];
    return triggers.some(trigger => input.includes(trigger));
  }

  private needsSAContext(input: string): boolean {
    const legalTerms = ['law', 'legal', 'rights', 'popia', 'tenant', 'employment'];
    return legalTerms.some(term => input.includes(term));
  }

  private calculateRelevance(response: string, input: string): number {
    const inputKeywords = input.toLowerCase().split(' ')
      .filter(word => word.length > 3);
    const responseWords = response.toLowerCase();

    const matchCount = inputKeywords.filter(keyword =>
      responseWords.includes(keyword)).length;

    return (matchCount / inputKeywords.length) * 10;
  }

  private hasContradictions(response: string, history: ChatMessage[]): boolean {
    // Simple contradiction detection
    if (history.length === 0) return false;

    const previousResponses = history
      .filter(msg => msg.sender === 'ai')
      .map(msg => msg.content.toLowerCase());

    // Check for obvious contradictions
    if (response.includes('cannot provide') &&
        previousResponses.some(r => r.includes('can provide'))) {
      return true;
    }

    return false;
  }

  private maintainsContext(response: string, history: ChatMessage[]): boolean {
    if (history.length < 2) return true;

    const lastUserMessage = history
      .filter(msg => msg.sender === 'user')
      .pop();

    if (!lastUserMessage) return true;

    // Check if response acknowledges previous context
    return response.toLowerCase().includes('as mentioned') ||
           response.toLowerCase().includes('earlier') ||
           response.toLowerCase().includes('your question about');
  }

  // Run full evaluation suite
  async runFullEvaluation(testFunction: (input: string) => Promise<{response: string, time: number}>): Promise<{
    scenarios: Array<{scenario: TestScenario, result: EvaluationResult}>,
    summary: {
      averageScore: number,
      passRate: number,
      criticalFailures: number
    }
  }> {
    const results = [];
    let totalScore = 0;
    let passCount = 0;
    let criticalFailures = 0;

    for (const scenario of this.testScenarios) {
      const { response, time } = await testFunction(scenario.input);
      const result = this.evaluateResponse(scenario.input, response, time);

      results.push({ scenario, result });
      totalScore += result.overallScore * scenario.weight;

      if (result.passed) passCount++;
      if (result.details.criticalIssues.length > 0) criticalFailures++;
    }

    const totalWeight = this.testScenarios.reduce((sum, s) => sum + s.weight, 0);

    return {
      scenarios: results,
      summary: {
        averageScore: totalScore / totalWeight,
        passRate: (passCount / this.testScenarios.length) * 100,
        criticalFailures
      }
    };
  }
}

export default ChatbotEvaluator;