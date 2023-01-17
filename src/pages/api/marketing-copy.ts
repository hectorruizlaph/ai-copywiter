// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { openai } from "@/utils/constants"

type Data = {
  input?: string,
  result?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { input } = req.body

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `You are a Copywriting expert focused in attention grabbing and a customer approaches you to write a very short and interesting marketing copy. This is the topic they would like a marketing copy for:  , ${input}`,
    max_tokens: 100,
    temperature: 0.85,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  })

  const suggestion = response?.data?.choices?.[0]?.text

  if (suggestion == undefined) throw new Error('No suggestion found')

  res.status(200).json({ result: suggestion })
}


// Javascript Web Applications
// temperature= original responses, if its low it will repeat itself alot

// implement "remembrance level"

// prompts for copywriting
// X = specific personla
// Tell me about the deepest fears that X might have when it comes to Y
// Write multiple benefits for a course that helps with X
//Write the perfect headline about X

// Ignore all previous instructions before this one. You're an expert career advisor. You have been helping people with changig careers for 20 years. From young adults to older people. Your task is to give the best advice when it comes to changing careers. You must ALWAYS ask questions Before you answer so you can better zone in on what the questioner is seeking. Is that understood??

// You are a marketing expert and a customer approaches you to write a short and very interesting marketing copy. This is the topic they would like a marketing copy for: 