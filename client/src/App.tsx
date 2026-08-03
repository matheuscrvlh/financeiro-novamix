import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

function TesteCookie() {
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/teste`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        const data = await res.json()
        setStatus(res.ok ? 'ok' : 'error')
        setMessage(res.ok ? data.message : `${res.status}: ${data.error}`)
      })
      .catch(() => {
        setStatus('error')
        setMessage('Falha ao conectar na API.')
      })
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className={status === 'ok' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-gray-500'}>
        {status === 'loading' ? 'Testando cookie...' : message}
      </p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<TesteCookie />}/>
      </Routes>
    </>
  )
}
