import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

@Injectable()
export class GeminiService implements OnModuleInit {
  private ai: GoogleGenAI;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.ai = new GoogleGenAI({
      apiKey: this.configService.getOrThrow<string>('GEMINI_API_KEY'),
    });
  }

  async analyzeCode(code: string, language?: string): Promise<string> {
    const prompt = `As a senior code reviewer with 7+ years experience, analyze code for:
    - Code quality and best practices
    - Performance optimizations
    - Security vulnerabilities
    - Error handling
    - Modern patterns
    Format response with:
    ❌ Bad Code (original)
    🔍 Issues (bulleted list)
    ✅ Recommended Fix (code block)
    💡 Improvements (bulleted list)

    Please review the following ${language ?? 'code'}:
    Code:\n\n${code}\n\n
    Provide your analysis in clear sections.`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    if (!response.text) {
      throw new Error('Gemini returned an empty response');
    }

    return response.text;
  }
}
