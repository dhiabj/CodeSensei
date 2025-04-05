const OpenAI = require('openai');

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function analyzeCode(code) {
  try {
    const response = await deepseek.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `As a senior code reviewer with 7+ years experience, analyze code for:
                  - Code quality and best practices
                  - Performance optimizations
                  - Security vulnerabilities
                  - Error handling
                  - Modern patterns
                  Format response with:
                  ❌ Bad Code (original)
                  🔍 Issues (bulleted list)
                  ✅ Recommended Fix (code block)
                  💡 Improvements (bulleted list)`,
        },
        {
          role: 'user',
          content: `Review this code: ${code}`,
        },
      ],
      temperature: 0.0,
      max_tokens: 400,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw new Error('Failed to analyze code');
  }
}

module.exports = { analyzeCode };
