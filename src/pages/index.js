import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Album from "../components/album/Album";
import Loader from "../components/loader/Loader";
import Image from "next/image";
import { useAccount, useContractRead } from "wagmi";

import Mementory from "../contract/Mementory.json";

import mementoryIcon from "../assets/img/logo_icon.png";

const NotConnected = () => {
  return (
    <div className=" overflow-hidden flex flex-col items-center p-6 bg-white rounded-md shadow-sm border border-border-color sm:w-3/4 sm:flex-row">
      <div className="w-1/3 mb-4 sm:mb-0">
        <Image src={mementoryIcon} alt="mementory" height={200} width={200} />
      </div>
      <div className="flex flex-col text-center justify-center sm:w-2/3 sm:text-left sm:pl-6">
        <h2 className="font-bold text-2xl text-title-color">
          Connect Your Wallet
        </h2>
        <p className="text-txt-color text-base mt-4">
          To use the Application, connect with one of the available wallet
          providers by clicking the button at the top of the page (or in the
          menu on mobile).
        </p>
        <p className="text-txt-color text-base mt-4">
          If you need help setting up a wallet, please check our FAQ in the{" "}
          <Link href="/help">
            <a className="font-semibold text-primary">Help</a>
          </Link>{" "}
          section.
        </p>
      </div>
    </div>
  );
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(true);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  // wagmi hook
  const {
    data: balanceOf,
    error: balanceOfError,
    isError: balanceOfIsError,
    isLoading: balanceOfIsLoading,
  } = useContractRead({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: Mementory.abi,
    functionName: "balanceOf",
    args: address,
  });

  return (
    <div className="flex flex-col-reverse items-center justify-center h-full max-w-main mx-auto px-3 mt-24 mb-12 md:flex-row md:items-start sm:px-6">
      <Head>
        <title>Mementory - Decentralized Photo Album</title>
        <meta
          name="description"
          content="Mementory is a decentralized photo album running on the Avalanche blockchain"
        />
      </Head>
      {!isConnected ? (
        <NotConnected />
      ) : balanceOfIsLoading ? (
        <Loader message="Loading your data... Please wait." />
      ) : balanceOfIsError ? (
        <>
          <p>Error when loading your photos. Please try again.</p>
          <p>{balanceOfError}</p>
        </>
      ) : (
        <Album address={address} balanceOf={balanceOf} isOwner={true} />
      )}
    </div>
  );
}
