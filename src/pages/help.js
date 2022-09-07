import Head from "next/head";
import HelpItem from "../components/help/HelpItem";

const data = [
  {
    id: 1,
    title: "What is Mementory?",
    desc: "Mementory is a decentralized Photo Album created by the AXP3 Studio.\n You can connect your wallet to the application to access your dedicated space, and start posting photos in a few seconds. All photos uploaded are minted as a NFT and stored on IPFS - a distributed file system protocol - to ensure that your album stays permanently accessible.",
  },
  {
    id: 2,
    title: "Which Chain and Network are we using?",
    desc: "Mementory is a Decentralized Application entirely run with a smart contract deployed on the Avalanche Blockchain.\nAs the project is still in Beta phase, it is currently deployed on Avalanche FUJI C-Chain, the testnet of the Avalanche network.",
  },
  {
    id: 3,
    title: "How to Connect a Wallet?",
    desc: "To use the Application built on the Blockchain, you need to create and connect a Wallet on the Avalanche FUJI C-Chain network. If you need help setting up a Wallet, we recommend using Metamask, and referring to this ",
    url: "https://academy.binance.com/en/articles/how-to-use-metamask",
  },
  {
    id: 4,
    title: "How to add Photos to your Album?",
    desc: 'Once your Wallet connected, use the form called "Add a Photo” at the right side of the Homepage to upload a photo (PNG or JPG format) and fill a description for your photo, as well as optional hashtags. Your photo will be uploaded on IPFS, and you will need to confirm the transaction prompted by your Wallet Provider and pay a small gas fee to permanently add your photo to your album.',
  },
  {
    id: 5,
    title: "Are my photos private?",
    desc: "Decentralized Applications running on the Blockchain cannot be made private, so keep in mind that all photos that you upload can be accessed and viewed by others (even if only you can add or remove photos from your albums).",
  },
  {
    id: 6,
    title: "How to remove a Photo from your Album?",
    desc: 'To remove a photo from your Album, click on the three dots at the bottom-right of the photo and select "Delete". You will need to confirm the transaction prompted by your Wallet Provider and pay a small gas fee to permanently remove the photo.',
  },
  {
    id: 7,
    title: "How to share your Album?",
    desc: 'You can get the URL to your album by clicking on the icon next to your Wallet address on the Homepage. The photos that you have marked "Private" won\'t be seen by others.',
  },
];

export default function Help() {
  return (
    <div className="flex flex-col items-center h-full max-w-main mx-auto px-6 my-24 mb-12">
      <Head>
        <title>Mementory - FAQ</title>
        <meta
          name="description"
          content="Everything you need to know about Mementory"
        />
      </Head>
      <p className="font-bold text-subtitle-color">FAQ</p>
      <h2 className="font-bold text-title-color text-3xl mt-2 capitalize">
        All You Need To Know
      </h2>
      <div className="w-full h-full mt-8 sm:w-[80vw] md:w-[600px]">
        {data.map((item) => (
          <HelpItem
            key={item.id}
            title={item.title}
            desc={item.desc}
            url={item.url}
          />
        ))}
      </div>
    </div>
  );
}
