import { useConnect,useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';



export default  function WalletConnector() {

  const { connectors, connect } = useConnect();
   const { address } = useAccount();
  // console.log(connectors)

  const coinbaseConnector = connectors.find(connector => connector.name === 'Coinbase Wallet');
  if (address) return null;
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Connect Your Wallet</h2>
      <div className=" flex justify-center items-center">
        {coinbaseConnector && (
          <button
            key={coinbaseConnector.uid}
            onClick={() => connect({ connector: coinbaseConnector })}
            className="flex items-center justify-center p-4 bg-[#4b44ca]  hover:bg-[#5357d8]  text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <span className="mr-2 text-xl">
              { <Wallet className="w-6 h-6" />}
            </span>
            <span className="font-medium">{coinbaseConnector.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}