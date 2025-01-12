import { FC } from 'react';

interface MnemonicFormProps {
  mnemonic: string;
  address: string;
  privateKey: string;
  mnemonicLength: number;
  setMnemonic: (mnemonic: string) => void;
  setAddress: (address: string) => void;
  setPrivateKey: (privateKey: string) => void;
  setMnemonicLength: (length: number) => void;
  generateAndSetKeys: () => void;
}

const MnemonicForm: FC<MnemonicFormProps> = ({
  mnemonic,
  address,
  privateKey,
  mnemonicLength,
  setMnemonicLength,
  generateAndSetKeys,
}) => {
  return (
    <div style={{ marginTop: '1rem' }}>
      <select
        value={mnemonicLength}
        onChange={(e) => setMnemonicLength(Number(e.target.value))}
      >
        {[12, 15, 18, 24].map((length) => (
          <option key={length} value={length}>
            {length} words
          </option>
        ))}
      </select>
      <button onClick={generateAndSetKeys}>Generate Deterministic Keys</button>
      <div>
        {mnemonic && <p>Mnemonic: {mnemonic}</p>}
        {address && <p>Address: {address}</p>}
        {privateKey && <p>Private Key: {privateKey}</p>}
      </div>
    </div>
  );
};

export default MnemonicForm;
