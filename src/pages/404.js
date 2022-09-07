import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";
import Head from "next/head";
import Album from "../components/album/Album";
import Loader from "../components/loader/Loader";
import { useAccount, useContractRead } from "wagmi";

import Mementory from "../contract/Mementory.json";

export default function Custom404() {
  const router = useRouter();
  const [address, setAddress] = useState("");

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

  useEffect(() => {
    /*const regex = new RegExp(/^0x[a-fA-F0-9]{40}$/g);
    const path = router.asPath.substring(1);
    const matches = path.match(regex);
    matches && matches.length === 1 && setAddress(matches[0]);*/
    const path = router.asPath.substring(1);
    ethers.utils.isAddress(path) && setAddress(path);
  }, [router]);

  return (
    <div className="flex flex-col-reverse items-center justify-center h-full max-w-main mx-auto px-3 mt-24 mb-12 md:flex-row md:items-start sm:px-6">
      <Head>
        <title>Mementory - Decentralized Photo Album</title>
        <meta
          name="description"
          content="Mementory is a decentralized photo album running on the Avalanche blockchain"
        />
      </Head>
      {!address ? (
        <div className="text-center">
          <p className="mb-2">This is not a valid wallet address.</p>
          <p>
            Go back to the{" "}
            <Link href="/">
              <a className="font-bold text-primary">Homepage</a>
            </Link>
          </p>
        </div>
      ) : balanceOfIsLoading ? (
        <Loader message="Loading data... Please wait." />
      ) : balanceOfIsError ? (
        <>
          <p>Error when loading the photos. Please try again.</p>
          <p>{balanceOfError}</p>
        </>
      ) : (
        <Album address={address} balanceOf={balanceOf} isOwner={false} />
      )}
    </div>
  );
}
