import React, { useState } from "react";
import Feed from "../feed/Feed";
import Form from "../form/Form";
import Image from "next/image";
import { formatAddress } from "../../scripts/utils";
import { getAvatarFromAddress } from "../../scripts/utils";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { StyledMenu } from "../menu/StyledMenu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import LinkIcon from "@mui/icons-material/Link";
import CancelIcon from "@mui/icons-material/Cancel";

export default function Album(props) {
  const { address, balanceOf, isOwner } = props;
  const [photoBalance, setPhotoBalance] = useState(balanceOf.toString());

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleURL = () => {
    const url = window.location.href + address;
    navigator.clipboard.writeText(url);
    console.log(`URL copied: ${url}`);
    handleClose();
  };

  return (
    <>
      <Feed
        address={address}
        balanceOf={balanceOf}
        isOwner={isOwner}
        setPhotoBalance={setPhotoBalance}
      />
      <div className="w-form h-fit mb-6 md:mb-0">
        <div className="mb-6 md:mt-5">
          {!isOwner && (
            <div className="mb-4 text-sm font-bold text-subtitle-color text-center md:text-left">
              Album Owner
            </div>
          )}
          <div className="flex flex-row justify-center">
            <Image
              src={getAvatarFromAddress(address)}
              alt="avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col justify-center px-4 text-sm md:flex-auto">
              <div className="flex flex-row items-center font-semibold text-title-color">
                {formatAddress(address)}
                {isOwner && (
                  <>
                    <ArrowTopRightOnSquareIcon
                      id="context-button"
                      className="h-4 w-4 text-primary stroke-2 ml-1 cursor-pointer"
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
                      <MenuItem onClick={handleURL} disableRipple>
                        <LinkIcon />
                        Copy album URL
                      </MenuItem>
                    </StyledMenu>
                  </>
                )}
              </div>
              <div className="text-txt-color ">
                {(isOwner ? balanceOf.toString() : photoBalance) + " photo"}
                {isOwner
                  ? balanceOf.toString() > 1
                    ? "s"
                    : ""
                  : photoBalance > 1
                  ? "s"
                  : ""}
              </div>
            </div>
          </div>
        </div>
        {isOwner && <Form />}
        <div className="hidden text-xs text-subtitle-color mt-4 uppercase pl-2 md:block">
          © 2022 Mementory by AXP3 Studio
        </div>
      </div>
    </>
  );
}
