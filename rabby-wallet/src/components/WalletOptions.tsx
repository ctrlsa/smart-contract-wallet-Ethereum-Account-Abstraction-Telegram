import { useConnect,useAccount } from 'wagmi';
import { Wallet } from 'lucide-react';



export default  function WalletConnector() {

  const { connectors, connect } = useConnect();
   const { address } = useAccount();

  // Filter connectors to only include Rabby
  const rabbyConnector = connectors.find(connector => connector.name === 'Rabby Wallet');
  if (address) return null;
  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Connect Your Wallet</h2>
      <div className=" flex justify-center items-center">
        {rabbyConnector && (
          <button
            key={rabbyConnector.uid}
            onClick={() => connect({ connector: rabbyConnector })}
            className="flex items-center justify-center p-4 bg-gray-700  hover:bg-gray-600 text-white rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            <span className="mr-2 text-xl">
              { <Wallet className="w-6 h-6" />}
            </span>
            <span className="font-medium">{rabbyConnector.name}</span>
          </button>
        )}
      </div>
    </div>
  );
}