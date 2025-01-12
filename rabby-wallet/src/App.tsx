
import WalletConnector from './components/WalletOptions'
import { UserBalance } from './components/UserBalance.tsx'
import { SendTransaction } from './components/SendTransaction.tsx'



function App() {
 
 
  return (
   
        <div >
   
        <WalletConnector/>
        <UserBalance/>
        <SendTransaction/>
        </div>
     
  )
}

export default App;