import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { KERNEL_V3_1 } from "@zerodev/sdk/constants";
import { bundlerActions, ENTRYPOINT_ADDRESS_V07 } from "permissionless";
import { useEffect, useState } from "react";
import { createPublicClient, http, parseAbi, encodeFunctionData } from "viem";
import { sepolia } from "viem/chains";
import { type Transport } from "viem";
import { createKernelAccount, createKernelAccountClient, createZeroDevPaymasterClient, KernelSmartAccount } from "@zerodev/sdk";
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"

// @dev add your BUNDLER_URL, PAYMASTER_URL, and PASSKEY_SERVER_URL here
const BUNDLER_URL = import.meta.env.VITE_BUNDLER_URL;
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL;
const CHAIN = sepolia;
const entryPoint = ENTRYPOINT_ADDRESS_V07;

const contractAddress = "0x34bE7f35132E97915633BC1fc020364EA5134863";
const contractABI = parseAbi([
  "function mint(address _to) public",
  "function balanceOf(address owner) external view returns (uint256 balance)",
]);

const publicClient = createPublicClient({
  transport: http(BUNDLER_URL),
});

let kernelAccount: KernelSmartAccount<
  typeof ENTRYPOINT_ADDRESS_V07,
  Transport,
  undefined
>;
let kernelClient: any;

export default function ZeroDev() {
  const [mounted, setMounted] = useState(false);
  const [accountAddress, setAccountAddress] = useState("");
  const [isKernelClientReady, setIsKernelClientReady] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSendingUserOp, setIsSendingUserOp] = useState(false);
  const [userOpHash, setUserOpHash] = useState("");
  const [userOpStatus, setUserOpStatus] = useState("");

  const createAccountAndClient = async (passkeyValidator: any) => {
    kernelAccount = await createKernelAccount(publicClient, {
      entryPoint,
      plugins: {
        sudo: passkeyValidator,
      },
      kernelVersion: KERNEL_V3_1,
    });

    console.log("Kernel account created: ", kernelAccount.address);

    kernelClient = createKernelAccountClient({
      account: kernelAccount,
      chain: CHAIN,
      bundlerTransport: http(BUNDLER_URL),
      entryPoint,
      middleware: {
        sponsorUserOperation: async ({ userOperation }) => {
          const zeroDevPaymaster = await createZeroDevPaymasterClient({
            chain: CHAIN,
            transport: http(PAYMASTER_URL),
            entryPoint,
          });
          return zeroDevPaymaster.sponsorUserOperation({
            userOperation,
            entryPoint,
          });
        },
      },
    });

    setIsKernelClientReady(true);
    setAccountAddress(kernelAccount.address);
  };

  // Function to be called when "Register" is clicked
  const handleRegister = async () => {
    setIsRegistering(true);

    // Construct a signer
    const privateKey = generatePrivateKey();
    const signer = privateKeyToAccount(privateKey);

    // Construct a validator
    const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
      signer,
      entryPoint,
      kernelVersion: KERNEL_V3_1,
    });

    await createAccountAndClient(ecdsaValidator);

    setIsRegistering(false);
    window.alert("Register done.  Try sending UserOps.");
  };



  // Function to be called when "Login" is clicked
  const handleSendUserOp = async () => {
    setIsSendingUserOp(true);
    setUserOpStatus("Sending UserOp...");

    const userOpHash = await kernelClient.sendUserOperation({
      userOperation: {
        callData: await kernelAccount.encodeCallData({
          to: contractAddress,
          value: BigInt(0),
          data: encodeFunctionData({
            abi: contractABI,
            functionName: "mint",
            args: [kernelAccount.address],
          }),
        }),
      },
    });

    setUserOpHash(userOpHash);

    const bundlerClient = kernelClient.extend(
      bundlerActions(ENTRYPOINT_ADDRESS_V07)
    );
    await bundlerClient.waitForUserOperationReceipt({
      hash: userOpHash,
      pollingInterval: 3000,
      timeout: 1200000,
    });

    // Update the message based on the count of UserOps
    const userOpMessage = `UserOp completed. <a href="https://jiffyscan.xyz/userOpHash/${userOpHash}?network=${CHAIN}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-700">Click here to view.</a>`;

    setUserOpStatus(userOpMessage);
    setIsSendingUserOp(false);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  // Spinner component for visual feedback during loading states
  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-24">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-4xl font-semibold text-center mb-12">
          ZeroDev ECDSA Demo
        </h1>

        <div className="space-y-4">
          {/* Account Address Label */}
          {accountAddress && (
            <div className="text-center mb-4">
              Account address:{" "}
              <a
                href={`https://jiffyscan.xyz/account/${accountAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                {" "}
                {accountAddress}{" "}
              </a>
            </div>
          )}

          {/* Register and Login Buttons */}
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            {/* Register Button */}
            <button
              onClick={handleRegister}
              disabled={isRegistering}
              className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
            >
              {isRegistering ? <Spinner /> : "Create account"}
            </button>
          </div>

          {/* Send UserOp Button */}
          <div className="flex flex-col items-center w-full">
            <button
              onClick={handleSendUserOp}
              disabled={!isKernelClientReady || isSendingUserOp}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 flex justify-center items-center w-full ${
                isKernelClientReady && !isSendingUserOp
                  ? "bg-green-500 hover:bg-green-700 focus:ring-green-500"
                  : "bg-gray-500"
              }`}
            >
              {isSendingUserOp ? <Spinner /> : "Send UserOp"}
            </button>
            {/* UserOp Status Label */}
            {userOpHash && (
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{
                  __html: userOpStatus,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
