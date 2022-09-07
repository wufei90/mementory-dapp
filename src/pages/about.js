import Image from "next/image";
import Head from "next/head";

import axp3Logo from "../assets/img/logo_axp3_big.png";

export default function About() {
  const onClick = (e) => {
    window.location.href = "mailto:contact@axplabs.com";
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center h-full max-w-main mx-auto px-6 mt-24 mb-12">
      <Head>
        <title>About Mementory</title>
        <meta
          name="description"
          content="Mementory is an app created by AXP3 Studio"
        />
      </Head>
      <div className="flex flex-col items-center text-center sm:w-4/5 md:w-3/4">
        <p className="font-bold text-subtitle-color">About Mementory</p>
        <h2 className="font-bold text-title-color text-3xl mt-2 capitalize">
          The creators of Mementory
        </h2>
        <div className=" max-w-[250px] flex items-center justify-center my-8">
          <Image src={axp3Logo} width={230} height={91} alt="axp3" />
        </div>
        <div className="text-txt-color text-center">
          <p className="mb-4">
            Mementory is a decentralized Photo Album running on the Avalanche
            blockchain, created by the{" "}
            <span className="font-bold">AXP3 Studio</span>.
          </p>
          <p className="mb-4">
            AXP3 is a Web3 Studio with extensive expertise in all Web3-related
            developments: Smart Contracts, DApps, NFT Collections, Fullstack
            Dev, and much more.
          </p>
          <p className="font-bold text-primary mb-8">
            Want to start your own project? Drop us an email by clicking on the
            button below.
          </p>
          <div className="flex justify-center">
            <button
              onClick={onClick}
              className="flex flex-row justify-center items-center bg-primary text-white font-bold rounded-lg py-3 px-6 transition duration-300 hover:bg-accent focus:border-none"
            >
              Contact AXP3
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
