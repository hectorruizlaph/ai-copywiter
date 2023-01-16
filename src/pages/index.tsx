import { useState, useEffect } from "react"
import Head from 'next/head'


export default function Home({ inputCharacterLimit }: any) {

  const [input, setInput] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState("")

  const submit = async () => {
    // check input limit
    if (input.length >= inputCharacterLimit) {
      return setError(true)
    }

    // set loading
    setLoading(true)
    try {
      const res = await fetch('/api/marketing-copy', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      })

      const suggestion: { result: string } = await res.json()
      setSuggestion(suggestion?.result)

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (input.length < inputCharacterLimit) {
      setError(false)
    } else {
      setError(true)
    }
  }, [input, inputCharacterLimit])

  return (
    <>
      <Head>
        <title>AI Copywriter</title>
        <meta name="description" content="Generate unlimited content" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-2xl font-bold text-center py-4">Type Your product/service </h2>

        <div className="flex flex-col gap-4 justify-center mx-auto max-w-md">

          <div className="w-full relative">
            <textarea
              className={`w-full border-2 ${error ? "border-red-600 text-gray-400" : "border-gray-300"} bg-white p-4 focus:outline-none  rounded-lg resize-none`}
              rows={4}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={inputCharacterLimit}
            />

            {error && <div className="absolute bottom-2 left-2"><p className="text-red-600">Please buy more credits for larger inputs</p></div>}
            <div className={`absolute bottom-2 right-2 ${error ? "text-red-600" : "text-gray-400"}`}>

              <span>{input.length}</span>/{inputCharacterLimit}
            </div>
          </div>

          <button onClick={submit} disabled={error ? true : false} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-slate-300">
            {loading ? "Loading..." : "Generate"}
          </button>

          {suggestion ? <div>
            <p>{suggestion}</p>
          </div> : null}
        </div>

      </div>
    </>
  )
}

export const getServerSideProps = async () => {
  const inputCharacterLimit = process.env.INPUT_CHARACTER_LIMIT
  return {
    props: {
      inputCharacterLimit
    }
  }
}