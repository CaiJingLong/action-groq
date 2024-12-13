import * as core from '@actions/core'
import Groq from 'groq-sdk'

function splitText(text: string, maxLength: number = 4000): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxLength) {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = sentence
    } else {
      currentChunk += sentence
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}

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

  const chunks = splitText(text)
  const summaries: string[] = []

  for (const chunk of chunks) {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: prompt
        },
        {
          role: 'user',
          content: chunk
        }
      ],
      model: model,
      max_tokens: maxTokens,
      temperature: 0.3
    })

    const summary = completion.choices[0]?.message?.content || ''
    summaries.push(summary)
  }

  if (summaries.length === 1) {
    return summaries[0]
  }

  const finalCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'Please combine the following summaries into a single coherent summary. Maintain logical flow and remove any redundant information.'
      },
      {
        role: 'user',
        content: summaries.join('\n---\n')
      }
    ],
    model: model,
    max_tokens: maxTokens,
    temperature: 0.3
  })

  return finalCompletion.choices[0]?.message?.content || ''
}

export async function run(): Promise<void> {
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
