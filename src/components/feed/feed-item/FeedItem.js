import React, { useState, useRef, useEffect } from "react";
import { ethers } from "ethers";
import Image from "next/image";
import LoadingScreen from "../../loader/LoadingScreen";
import { timeSince, FEED_DIM } from "../../../scripts/utils";
import {
  EllipsisHorizontalIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { StyledMenu } from "../../menu/StyledMenu";
import MenuItem from "@mui/material/MenuItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Divider from "@mui/material/Divider";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";

import Mementory from "../../../../artifacts/contracts/Mementory.sol/Mementory.json";

export default function FeedItem(props) {
  const { item, isOwner } = props;
  const { id, url, desc, hashtags, time, visibility } = item;

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const clampedTxt = useRef(null);

  const [isClamped, setIsClamped] = useState(true);
  const [btnName, setBtnName] = useState("More");
  const [btnHide, setBtnHide] = useState(false);
  const [txPending, setTxPending] = useState(false);

  const [ratio, setRatio] = useState(1);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    setBtnHide(detectClamp(clampedTxt.current));
  }, []);

  const detectClamp = (elm) => {
    return elm.scrollHeight > elm.clientHeight;
  };

  const displayFullText = () => {
    if (btnName === "More") {
      setBtnName("Less");
      setIsClamped(false);
    } else {
      setBtnName("More");
      setIsClamped(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(url);
    console.log(`URL copied: ${url}`);
    handleClose();
  };

  // Burn the token to remove from the feed
  const handleDelete = async () => {
    setTxPending(true);
    handleClose();
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        Mementory.abi,
        signer
      );
      let transaction = await contract.burnToken(id);
      let tx = await transaction.wait();
      setTxPending(false);
      window.location.reload();
    } catch (error) {
      setTxPending(false);
      alert("Error when trying to delete the photo. Please try again later");
      console.log("Error when burning: ", error);
    }
  };

  return (
    <div className="w-full overflow-hidden flex flex-col bg-white rounded-md mb-4 shadow-sm border border-border-color">
      {txPending && (
        <LoadingScreen message="Transaction pending...\nPlease do not refresh the page until the end." />
      )}
      <Image
        src={url}
        alt="Feed Image"
        width={FEED_DIM}
        height={FEED_DIM / ratio}
        onLoadingComplete={({ naturalWidth, naturalHeight }) =>
          setRatio(naturalWidth / naturalHeight)
        }
        className="border-b"
      />
      <div className="px-4 pt-4 pb-3 border-b">
        <div
          ref={clampedTxt}
          className={
            "text-sm line-clamp-3 text-txt-color " +
            (!isClamped && "line-clamp-none")
          }
        >
          {desc.split("\n").map((str, idx) => (
            <p key={idx}>{str}</p>
          ))}
        </div>
        {btnHide && (
          <div
            className="text-sm text-subtitle-color uppercase cursor-pointer mt-2"
            onClick={displayFullText}
          >
            {btnName}
          </div>
        )}
        {hashtags.length > 0 && (
          <div className="mt-4 flex flex-row flex-wrap">
            {hashtags.map((item, index) => (
              <div
                className="text-xs text-subtitle-color font-medium uppercase border-2 mb-1 border-border-color rounded-xl px-3 py-1 mr-1"
                key={index}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-row justify-between px-4 py-2 text-sm">
        <div className="flex flex-row">
          {visibility === "private" && (
            <LockClosedIcon className="h-5 w-5 text-subtitle-color mr-2" />
          )}

          <div className="text-subtitle-color">{timeSince(time)} ago</div>
        </div>
        <div>
          <EllipsisHorizontalIcon
            id="context-button"
            className="h-6 w-6 text-subtitle-color cursor-pointer hover:bg-bg-1"
            aria-controls={open ? "context-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          />
          <StyledMenu
            id="context-menu"
            MenuListProps={{
              "aria-labelledby": "context-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleCopyURL} disableRipple>
              <LinkIcon />
              Copy URL
            </MenuItem>
            {isOwner && (
              <MenuItem onClick={handleDelete} disableRipple>
                <DeleteOutlineIcon />
                Delete
              </MenuItem>
            )}
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleClose} disableRipple>
              <CloseIcon />
              Close
            </MenuItem>
          </StyledMenu>
        </div>
      </div>
    </div>
  );
}
