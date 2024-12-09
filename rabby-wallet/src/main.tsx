import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from './config.ts'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  
   <WagmiProvider config={config}>
   <QueryClientProvider client={queryClient}> 
     <div className='text-2xl sticky font-bold text-center p-12 '>

     <StrictMode>
    <App />
  </StrictMode>
     </div>
   </QueryClientProvider> 
 </WagmiProvider>
)
