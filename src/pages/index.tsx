import { useTurnkey, type WalletProvider } from "@turnkey/react-wallet-kit";
import { Geist, Geist_Mono } from "next/font/google";
import { useCallback, useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [providers, setProviders] = useState<WalletProvider[] | null>();

  const {
    fetchWalletProviders,
    signMessage,
    disconnectWalletAccount,
    wallets,
    connectWalletAccount,
  } = useTurnkey();
  const fetchProviders = useCallback(async () => {
    try {
      await fetchWalletProviders()
        .then((providers) => {
          console.log(providers);
          setProviders(providers);
        })
        .catch((e) => {
          console.error(e);
        });
    } catch (error) {
      console.error("Error fetching providers:", error);
    }
  }, [fetchWalletProviders]);
  console.log(wallets);
  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className={"grid grid-cols-3 gap-4"}>
          {providers?.map((provider) => (
            <button
              key={provider.info.uuid}
              type={"button"}
              className={` items-center gap-2 border rounded p-4 cursor-pointer inline-flex ${provider.connectedAddresses.length && "border-[#f00]"}`}
              onClick={() => {
                if (provider.connectedAddresses.length) {
                  disconnectWalletAccount(provider)
                    .then(() => {
                      fetchProviders();
                    })
                    .catch((e) => {
                      console.error(
                        "Error disconnecting this wallet account:",
                        e,
                      );
                    });
                  return;
                }
                connectWalletAccount(provider)
                  .then(async (connectedWallet) => {
                    console.log(connectedWallet);
                    const msg = "Hello";
                    const signature = await signMessage({
                      message: msg,
                      walletAccount: connectedWallet,
                      addEthereumPrefix:
                        provider.chainInfo.namespace === "ethereum",
                    });
                    console.log(signature);
                    fetchProviders();
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              }}
            >
              <img
                src={provider.info.icon || "/placeholder-icon.svg"}
                alt={provider.info.name}
                width={32}
                height={32}
              />
              <span className="flex flex-col">
                <span className={"text-sm font-medium"}>
                  {provider.info.name}
                </span>
                <span className={"text-xs text-gray-500"}>
                  {provider.chainInfo.namespace}
                </span>
              </span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
