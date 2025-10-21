import {
  TurnkeyProvider,
  type TurnkeySDKClientConfig,
} from "@turnkey/react-wallet-kit";

const turnkeyConfig: TurnkeySDKClientConfig = {
  organizationId: process.env.NEXT_PUBLIC_ORGANIZATION_ID!,
  authProxyConfigId: process.env.NEXT_PUBLIC_AUTH_PROXY_CONFIG_ID!,
  walletConfig: {
    features: {
      // enable external wallet authentication
      auth: true,
      connecting: true,
    },
    chains: {
      ethereum: {
        // enable native EIP-1193 Ethereum providers (e.g., MetaMask, Phantom)
        native: true,
        // enable WalletConnect for Ethereum mainnet
        walletConnectNamespaces: ["eip155:1"],
      },
      solana: {
        // enable native Solana Wallet Standard providers (e.g., MetaMask, Phantom)
        native: true,
        // enable WalletConnect for Solana mainnet
        walletConnectNamespaces: ["solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"],
      },
    },
  },
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TurnkeyProvider
      config={turnkeyConfig}
      callbacks={{
        onError: (error) => console.error("Turnkey error:", error),
      }}
    >
      {children}
    </TurnkeyProvider>
  );
}
