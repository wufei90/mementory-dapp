import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedItem from "./feed-item/FeedItem";
import Loader from "../loader/Loader";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import Mementory from "../../contract/Mementory.json";

import mementoryIcon from "../../assets/img/logo_icon.png";

export default function Feed(props) {
  const { address, balanceOf, isOwner, setPhotoBalance } = props;
  // We retrieve images by batch of 10
  const batchSize = 10;
  const [dataFeed, setDataFeed] = useState([]);
  const [data, setData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [feedisLoading, setFeedIsLoading] = useState(true);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  useEffect(() => {
    if (balanceOf.toString() > 0) {
      loadPhotos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceOf]);

  async function loadPhotos() {
    if (window.ethereum && address !== undefined && balanceOf !== undefined) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const mementory = new ethers.Contract(
          CONTRACT_ADDRESS,
          Mementory.abi,
          signer
        );

        // First get token ids based on balanceOf
        const tokenIds = [];
        for (let i = 0; i < balanceOf; i++) {
          const id = await mementory.tokenOfOwnerByIndex(address, i);
          tokenIds.push(id.toString());
        }

        // Then get metadata from ipfs
        const photos = await Promise.all(
          tokenIds.map(async (i) => {
            const tokenURI = await mementory.tokenURI(i);
            const metadata = await axios.get(tokenURI);
            let item = {
              id: i,
              desc: metadata.data.desc,
              hashtags: metadata.data.hashtags,
              visibility: metadata.data.visibility,
              url: metadata.data.image,
              time: metadata.data.time,
            };
            return item;
          })
        );

        // Remove private photos if not the Owner
        let filteredArr;
        if (!isOwner) {
          filteredArr = photos.filter((i) => i.visibility === "public");
        } else {
          filteredArr = photos;
        }

        // Nothing to render if no public images
        if (filteredArr.length == 0) {
          setDataFeed([]);
          setData([]);
          setPhotoBalance(0);
          setFeedIsLoading(false);
          return;
        }

        // Reverse array to display latest photos first
        filteredArr.reverse();
        setDataFeed(filteredArr);
        setData(filteredArr.slice(0, batchSize));
        setPhotoBalance(filteredArr.length);
        setFeedIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const fetchMoreData = () => {
    if (data.length >= dataFeed.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setData((data) => [
        ...data,
        ...dataFeed.slice(data.length, data.length + batchSize),
      ]);
    }, 1000);
  };

  const NoPhotosYet = () => {
    return (
      <div className="flex flex-col items-center mt-5">
        <div className="w-[84px] h-[84px] flex justify-center items-center rounded-full border-2 border-primary">
          <Image src={mementoryIcon} width={50} height={50} alt="mementory" />
        </div>
        <div className="text-subtitle-color mt-2 text-lg">No Photos Yet</div>
      </div>
    );
  };

  return (
    <div className="max-w-feed flex flex-col md:mr-8 md:w-feed">
      {balanceOf.toString() == 0 ? (
        <NoPhotosYet />
      ) : feedisLoading ? (
        <div className="flex flex-col items-center mt-7 text-sm">
          <Loader message={"Loading your photos... Please wait."} />
        </div>
      ) : data.length === 0 ? (
        <NoPhotosYet />
      ) : (
        <InfiniteScroll
          dataLength={data.length} //This is important field to render the next data
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className="flex flex-row justify-center">
              <ArrowPathIcon className="h-6 w-6 mr-2 text-subtitle-color" />
              <span className="text-center text-subtitle-color">
                Loading...
              </span>
            </div>
          }
          endMessage={
            <p className="text-center mt-8 text-subtitle-color">
              All images have been loaded.
            </p>
          }
        >
          {data.map((item) => (
            <FeedItem key={item.id} item={item} isOwner={isOwner} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
