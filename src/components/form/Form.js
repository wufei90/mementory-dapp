import React, { useState } from "react";
import { ethers } from "ethers";
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import LoadingScreen from "../loader/LoadingScreen";
import {
  CloudArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Mementory from "../../../artifacts/contracts/Mementory.sol/Mementory.json";

let ipfs;
const authorization =
  "Basic " +
  Buffer.from(
    process.env.NEXT_PUBLIC_INFURA_PROJECT_ID +
      ":" +
      process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET
  ).toString("base64");
try {
  ipfs = create({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
      authorization,
    },
  });
} catch (error) {
  console.error("IPFS error ", error);
  ipfs = undefined;
}

export default function Form() {
  const [opened, setOpened] = useState(false);
  const [formParams, updateFormParams] = useState({
    desc: "",
    hashtags: "",
    visibility: "public",
  });
  const [fileURL, setFileURL] = useState(null);
  const [isDescMissing, setIsDescMissing] = useState(false);
  const [isPhotoMissing, setIsPhotoMissing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSetIndex = () => setOpened(!opened);

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const formatHashtags = (hashtags) => {
    if (hashtags === "") {
      return [];
    }
    const hashtagsArray = hashtags.split(" ");
    const formattedArray = hashtagsArray.map((hashtag) => {
      if (hashtag.charAt(0) === "#") {
        return hashtag;
      } else {
        return `#${hashtag}`;
      }
    });
    return formattedArray;
  };

  async function uploadToIPFS() {
    // First upload the photo on IPFS
    let imageURI;
    try {
      const result = await ipfs.add(fileURL);
      imageURI = `${process.env.NEXT_PUBLIC_INFURA_GATEWAY}/ipfs/${result.path}`;
    } catch (error) {
      console.log("Error uploading image: ", error);
      return;
    }

    if (imageURI === undefined) {
      return;
    }

    // Build metadata
    const { desc, hashtags, visibility } = formParams;
    const hashtagsArray = formatHashtags(formParams.hashtags);
    const timestamp = Math.floor(Date.now() / 1000);
    const metadata = JSON.stringify({
      desc,
      hashtags: hashtagsArray,
      visibility,
      image: imageURI,
      time: timestamp,
    });
    // Send metadata to IPFS
    let metadataURI;
    try {
      const result = await ipfs.add(metadata);
      metadataURI = `${process.env.NEXT_PUBLIC_INFURA_GATEWAY}/ipfs/${result.path}`;
      return metadataURI;
    } catch (error) {
      console.log("Error uploading metadata: ", error);
      return;
    }
  }

  async function mintPhoto(e) {
    // Remove default form action
    e.preventDefault();
    // Check that required fields are not empty
    if (formParams.desc === "" || !fileURL) {
      formParams.desc === "" ? setIsDescMissing(true) : setIsDescMissing(false);
      !fileURL ? setIsPhotoMissing(true) : setIsPhotoMissing(false);
      return;
    }
    // Clean errors
    setIsDescMissing(false);
    setIsPhotoMissing(false);

    // We can't go further if ipfs is not set
    if (!ipfs) {
      alert(
        "Problem connecting to the decentralized storage. Please try again later"
      );
      return;
    }
    try {
      // Initialize loading
      setMessage("Uploading your photo... Please wait.");
      setLoading(true);
      // First, get url of metadata on IPFS
      const metadataURI = await uploadToIPFS();

      if (metadataURI === undefined) {
        alert("Error when generating metadata. Please try again later");
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Next, create the NFT
      let contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Mementory.abi,
        signer
      );
      let transaction = await contract.createToken(metadataURI);
      setMessage(
        "Transaction pending...\nPlease do not refresh the page until the end."
      );
      let tx = await transaction.wait();

      //cleaning
      updateFormParams({
        desc: "",
        hashtags: "",
        visibility: "public",
      });
      setFileURL(null);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      alert("Error when trying to add the photo. Please try again later");
      console.log("Error when minting: ", error);
    }
  }

  return (
    <div className="flex flex-col border border-border-color rounded-md bg-white shadow-sm">
      {loading && <LoadingScreen message={message} />}
      <div
        onClick={handleSetIndex}
        className={
          "flex flex-row items-center justify-between py-3 px-4 bg-primary transition duration-300 cursor-pointer hover:bg-accent " +
          (opened ? "rounded-t-md" : "rounded-md")
        }
      >
        <PlusCircleIcon className="h-6 w-6 text-white" />
        <div className="flex-auto pl-2">
          <div className="text-white  text-sm font-semibold">Add a Photo</div>
        </div>
        {opened ? (
          <ChevronUpIcon className="h-5 w-5 text-white" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-white" />
        )}
      </div>
      {opened && (
        <form className="bg-white px-4 pt-6 pb-7 text-sm">
          <div className="mb-4">
            <label
              className="block text-subtitle-color font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow-sm appearance-none resize-none text-txt-color border placeholder-gray-300 rounded w-full text-sm py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
              id="desc"
              rows={5}
              name="desc"
              placeholder="Write your description"
              required
              onChange={(e) =>
                updateFormParams({ ...formParams, desc: e.target.value })
              }
              value={formParams.desc}
            />
            {isDescMissing && (
              <p className="text-xs text-red-700 mt-1">
                Description cannot be empty.
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="block text-subtitle-color font-bold mb-2"
              htmlFor="hashtags"
            >
              <div>Hashtags</div>
              <span className="text-xs font-normal text-gray-400">
                Separated with a space, no # sign
              </span>
            </label>
            <input
              className="shadow-sm appearance-none text-txt-color border placeholder-gray-300 rounded w-full text-sm py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
              id="hashtags"
              name="hashtags"
              placeholder="#"
              onChange={(e) =>
                updateFormParams({
                  ...formParams,
                  hashtags: e.target.value,
                })
              }
              value={formParams.hashtags}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-subtitle-color font-bold mb-2"
              htmlFor="visibility"
            >
              <div>Visibility</div>
              <span className="text-xs font-normal text-gray-400">
                Private photos wont be seen by others
              </span>
            </label>
            <div className="w-full relative">
              <select
                className="block appearance-none shadow-sm text-txt-color border rounded w-full text-sm py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) =>
                  updateFormParams({
                    ...formParams,
                    visibility: e.target.value,
                  })
                }
                value={formParams.visibility}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-subtitle-color">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label
              className="block text-subtitle-color font-bold mb-2"
              htmlFor="hashtags"
            >
              <div>Upload a photo</div>
              <span className="text-xs font-normal text-gray-400">
                PNG or JPG format only
              </span>
            </label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setFileURL(e.target.files[0])}
              className="opacity-0 overflow-hidden absolute z-[-1] w-[0.1px] h-[0.1px]"
            />
            <div className="mb-8">
              <div className="flex flex-row">
                <label
                  htmlFor="photo"
                  className="min-w-[105px] border border-border-color bg-gray-50 px-2 py-1 rounded font-normal text-subtitle-color cursor-pointer hover:bg-primary hover:text-white"
                >
                  Choose a file
                </label>
                <div
                  className={
                    "flex items-center flex-auto ml-2 border border-border-color rounded px-2 overflow-hidden " +
                    (fileURL ? "text-txt-color" : "text-gray-300")
                  }
                >
                  {fileURL ? fileURL.name : "No file selected"}
                </div>
              </div>
              {isPhotoMissing && (
                <p className="text-xs text-red-700 mt-1">
                  Please choose a photo.
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <button
                onClick={mintPhoto}
                className="flex flex-row justify-center items-center bg-primary text-white font-bold text-sm rounded-lg w-full py-2 transition duration-300 hover:bg-accent focus:border-none"
              >
                <CloudArrowUpIcon className="h-6 w-6 text-white mr-2" /> Upload
                Photo
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
