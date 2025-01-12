import { FC, useState } from 'react';
import { encryptData, decryptData } from '../../helpers/cryptography';

interface EncryptionFormProps {
  mnemonic: string;
  setError: (error: string) => void;
}

const EncryptionForm: FC<EncryptionFormProps> = ({ mnemonic, setError }) => {
  const [password, setPassword] = useState('');
  const [encryptedMnemonic, setEncryptedMnemonic] = useState('');
  const [decryptedMnemonic, setDecryptedMnemonic] = useState('');

  const handleEncrypt = async () => {
    if (!mnemonic || !password) {
      setError('Please provide both mnemonic and password');
      return;
    }

    try {
      const encrypted = await encryptData(mnemonic, password);
      setEncryptedMnemonic(encrypted);
      setDecryptedMnemonic('');
    } catch (error) {
      setError('Encryption failed');
      console.error(error);
    }
  };

  const handleDecrypt = async () => {
    if (!password || !encryptedMnemonic) {
      setError('Please provide password and encrypted data for decryption');
      return;
    }

    try {
      const decrypted = await decryptData(encryptedMnemonic, password);
      setDecryptedMnemonic(decrypted);
    } catch (error) {
      setError('Decryption failed');
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <input
        type="password"
        placeholder="Password for encryption"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt}>Decrypt</button>
      <div>
        {encryptedMnemonic && (
          <>
            <h3>Encrypted Mnemonic:</h3>
            <textarea rows={5} cols={50} value={encryptedMnemonic} readOnly />
          </>
        )}
        {decryptedMnemonic && (
          <>
            <h3>Decrypted Mnemonic:</h3>
            <textarea rows={5} cols={50} value={decryptedMnemonic} readOnly />
          </>
        )}
      </div>
    </div>
  );
};

export default EncryptionForm;
