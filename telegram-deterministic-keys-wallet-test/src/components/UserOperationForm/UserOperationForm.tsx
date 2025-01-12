import { FC, useState } from 'react';
import { ethers } from 'ethers';

interface UserOperationFormProps {
  mnemonic: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
}

const UserOperationForm: FC<UserOperationFormProps> = ({
  mnemonic,
  loading,
  setLoading,
  setError,
}) => {
  const [signedUserOp, setSignedUserOp] = useState('');

  const signUserOp = async () => {
    if (!mnemonic) {
      setError('Please generate keys first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      const provider = new ethers.JsonRpcProvider(
        'https://data-seed-prebsc-1-s1.binance.org:8545/'
      );
      const nonce = await provider.getTransactionCount(wallet.address);

      const userOp = {
        sender: wallet.address,
        nonce,
        to: '0xdD8C9F65fbdB130E21f0F45a4cB090E8871d815e',
        value: ethers.parseEther('0.01').toString(),
        data: '0x',
        gasLimit: 21000,
        maxFeePerGas: ethers.parseUnits('10', 'gwei').toString(),
        maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei').toString(),
        chainId: 97,
      };

      const signedUserOp = await wallet.signMessage(JSON.stringify(userOp));
      setSignedUserOp(signedUserOp);
      console.log('Signed User Operation:', signedUserOp);
    } catch (error) {
      setError('Failed to sign user operation');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={signUserOp}>
        {loading
          ? 'Signing User Operation...'
          : 'Sign User Operation (ERC-4337)'}
      </button>
      {signedUserOp && (
        <>
          <h3>Signed User Operation:</h3>
          <textarea rows={5} cols={50} value={signedUserOp} readOnly />
        </>
      )}
    </div>
  );
};

export default UserOperationForm;
