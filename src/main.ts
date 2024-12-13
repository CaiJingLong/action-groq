import * as core from '@actions/core'
import Groq from 'groq-sdk'

async function summarizeText(
  text: string,
  apiKey: string,
  model: string,
  maxTokens: number,
  prompt: string
): Promise<string> {
  const groq = new Groq({
    apiKey: apiKey
  })

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: prompt
      },
      {
        role: 'user',
        content: `${text}`
      }
    ],
    model: model,
    max_tokens: maxTokens,
    temperature: 0.3
  })

  return completion.choices[0]?.message?.content || ''
}

async function run(): Promise<void> {
  try {
    const text = core.getInput('text', { required: true })
    const apiKey = core.getInput('api_key', { required: true })
    const model = core.getInput('model')
    const maxTokens = parseInt(core.getInput('max_tokens'), 10)
    const prompt = core.getInput('prompt')

    core.debug('Summarizing text using Groq API...')
    const summary = await summarizeText(text, apiKey, model, maxTokens, prompt)
    
    core.setOutput('summary', summary)
    core.debug('Summary generated successfully')
  } catch (error) {
    if (error instanceof Error) {
      core.setOutput('error', error.message)
      core.setFailed(error.message)
    } else {
      core.setOutput('error', 'An unknown error occurred')
      core.setFailed('An unknown error occurred')
    }
  }
}

run()
