export class SentimentService {
  static analyze(content: string): 'positive' | 'neutral' | 'negative' | 'high_priority' {
    const text = content.toLowerCase();
    
    // Simple mock logic for sentiment
    const highPriorityKeywords = ['lawsuit', 'sue', 'scam', 'fraud', 'dangerous', 'terrible', 'worst'];
    const negativeKeywords = ['bad', 'poor', 'disappointed', 'late', 'broken', 'sad'];
    const positiveKeywords = ['great', 'awesome', 'love', 'perfect', 'happy', 'thanks', 'good'];

    for (const kw of highPriorityKeywords) {
      if (text.includes(kw)) return 'high_priority';
    }

    for (const kw of negativeKeywords) {
      if (text.includes(kw)) return 'negative';
    }

    for (const kw of positiveKeywords) {
      if (text.includes(kw)) return 'positive';
    }

    return 'neutral';
  }
}
