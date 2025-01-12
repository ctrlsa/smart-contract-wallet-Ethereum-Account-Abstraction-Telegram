import EncryptionForm from '@/components/EncryptionForm/EncryptionForm';
import MnemonicForm from '@/components/MnemonicForm/MnemonicForm';
import UserOperationForm from '@/components/UserOperationForm/UserOperationForm';
import useTelegramStore from '@/hooks/telegramStore';
import { FC, useEffect, useState } from 'react';
import { generateKeys } from '../../helpers/cryptography';
import './DeterministicKeyPage.css';

const DeterministicKeys: FC = () => {
  const [mnemonic, setMnemonic] = useState('');
  const [address, setAddress] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [mnemonicLength, setMnemonicLength] = useState<number>(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { setItem, getItem, isInitialized } = useTelegramStore();

  useEffect(() => {
    if (isInitialized) {
      const storedMnemonic = getItem('mnemonic');
      if (storedMnemonic) {
        setMnemonic(storedMnemonic);
      }
    }
  }, [isInitialized, getItem]);

  const generateAndSetKeys = () => {
    try {
      const { mnemonic, address, privateKey } = generateKeys(mnemonicLength);
      setMnemonic(mnemonic);
      setAddress(address);
      setPrivateKey(privateKey);

      if (isInitialized) {
        setItem('mnemonic', mnemonic);
      }
    } catch (error) {
      setError('Failed to generate keys');
      console.error(error);
    }
  };

  return (
    <div className="deterministic-keys-container">
      <div className="deterministic-keys-content">
        <h1>ERC-4337 Account Abstraction - Deterministic Keys</h1>
        <h2>0. Current Mnemonic (from Store)</h2>
        <div>{mnemonic}</div>
        <hr />

        <h2>1. Generate and Store Deterministic Keys</h2>
        <MnemonicForm
          mnemonic={mnemonic}
          address={address}
          privateKey={privateKey}
          mnemonicLength={mnemonicLength}
          setMnemonic={setMnemonic}
          setAddress={setAddress}
          setPrivateKey={setPrivateKey}
          setMnemonicLength={setMnemonicLength}
          generateAndSetKeys={generateAndSetKeys}
        />
        <hr />

        <h2>2. Encrypt Deterministic Keys</h2>
        <EncryptionForm mnemonic={mnemonic} setError={setError} />
        <hr />

        <h2>3. Sign An User Operation</h2>
        <UserOperationForm
          mnemonic={mnemonic}
          loading={loading}
          setLoading={setLoading}
          setError={setError}
        />
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </div>
  );
};

export default DeterministicKeys;
