// Prompt Injection Dataset Service
// Aggregates prompt injection payloads from internal sources and exposes them for UI consumption

import { injecagentBenchmark } from './benchmark-integration';
import { PayloadManager } from './payload-manager';

export interface PromptInjectionPayload {
  id: string;
  name: string;
  description: string;
  category: string;
  payload: string;
  expectedOutcome?: string;
  severity?: string;
  tags?: string[];
  source?: string;
}

export class PromptInjectionDatasetService {
  private static instance: PromptInjectionDatasetService;
  private payloads: PromptInjectionPayload[] = [];

  private constructor() {
    this.loadInternalPayloads();
  }

  public static getInstance(): PromptInjectionDatasetService {
    if (!PromptInjectionDatasetService.instance) {
      PromptInjectionDatasetService.instance = new PromptInjectionDatasetService();
    }
    return PromptInjectionDatasetService.instance;
  }

  private loadInternalPayloads() {
    // Load from injecagentBenchmark
    if (injecagentBenchmark && injecagentBenchmark.payloads) {
      this.payloads.push(...injecagentBenchmark.payloads.map(p => ({
        ...p,
        source: 'INJECAGENT Benchmark',
      })));
    }

    // Load from PayloadManager categories (direct/indirect prompt injection, etc.)
    const pm = new PayloadManager();
    const categories = pm.getCategories();
    for (const cat of categories) {
      if (cat.tags && cat.tags.includes('prompt-injection')) {
        // Try to get payloads for this category
        const catPayloads = pm.getPayloadsByCategory ? pm.getPayloadsByCategory(cat.id) : [];
        if (catPayloads && catPayloads.length > 0) {
          this.payloads.push(...catPayloads.map(p => ({
            ...p,
            category: cat.id,
            source: cat.source || 'Internal',
          })));
        }
      }
    }
  }

  public getAllPayloads(): PromptInjectionPayload[] {
    return this.payloads;
  }

  public getPayloadsByCategory(category: string): PromptInjectionPayload[] {
    return this.payloads.filter(p => p.category === category);
  }

  public getCategories(): string[] {
    return Array.from(new Set(this.payloads.map(p => p.category)));
  }
} 