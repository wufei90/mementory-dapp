import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { getAvatarFromAddress } from "../../scripts/utils";

export const CustomConnectButton = (props) => {
  const { showBalance, chainStatus } = props;
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="bg-primary text-white font-bold text-sm rounded-lg px-6 py-2 transition duration-300 hover:bg-accent"
                    onClick={openConnectModal}
                    type="button"
                  >
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="border border-border-color text-red-600 font-bold text-sm rounded-lg px-4 py-2 hover:shadow-sm"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: "flex", gap: 12 }}>
                  {chainStatus !== "none" && (
                    <button
                      onClick={openChainModal}
                      style={{ display: "flex", alignItems: "center" }}
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            overflow: "hidden",
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <Image
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              width={12}
                              height={12}
                            />
                          )}
                        </div>
                      )}
                      {chain.name}
                    </button>
                  )}

                  <button
                    className="border border-border-color text-title-color font-bold text-sm rounded-lg px-4 py-2 hover:shadow-sm"
                    onClick={openAccountModal}
                    type="button"
                  >
                    <span className="flex flex-row items-center justify-center">
                      <div className="mr-2 flex items-center">
                        <Image
                          src={
                            account.displayName
                              ? getAvatarFromAddress(account.displayName)
                              : ""
                          }
                          alt="avatar"
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                      {account.displayName}
                      {account.displayBalance && showBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                      <ChevronDownIcon className="h-4 w-4 text-black ml-2 stroke-2" />
                    </span>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
