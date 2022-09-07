import { utils } from "ethers";

// Import images for avatars
import defaultAvatar from "../assets/img/avatars/default_avatar.png";
import avatar1 from "../assets/img/avatars/1.png";
import avatar2 from "../assets/img/avatars/2.png";
import avatar3 from "../assets/img/avatars/3.png";
import avatar4 from "../assets/img/avatars/4.png";
import avatar5 from "../assets/img/avatars/5.png";
import avatar6 from "../assets/img/avatars/6.png";
import avatar7 from "../assets/img/avatars/7.png";
import avatar8 from "../assets/img/avatars/8.png";
import avatar9 from "../assets/img/avatars/9.png";
import avatar10 from "../assets/img/avatars/10.png";

// Width of the homepage feed
export const FEED_DIM = 470;

// Format wallet address
export const formatAddress = (address) => {
  if (address === "") {
    return "Unknown Address";
  }
  // Convert address to a checksum standard address
  address = utils.getAddress(address);
  // Extract first 4 and last 4 characters
  const formattedAddress = address.slice(0, 4) + "..." + address.slice(-4);
  return formattedAddress;
};

// Compute time since given date
export function timeSince(timestamp) {
  var date = new Date(timestamp * 1000);
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = seconds / 31536000;

  if (interval > 1) {
    const year = Math.floor(interval) == 1 ? " year" : " years";
    return Math.floor(interval) + year;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    const month = Math.floor(interval) == 1 ? " month" : " months";
    return Math.floor(interval) + month;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    const day = Math.floor(interval) == 1 ? " day" : " days";
    return Math.floor(interval) + day;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    const hour = Math.floor(interval) == 1 ? " hour" : " hours";
    return Math.floor(interval) + hour;
  }
  interval = seconds / 60;
  if (interval > 1) {
    const minute = Math.floor(interval) == 1 ? " minute" : " minutes";
    return Math.floor(interval) + minute;
  }
  return Math.floor(seconds) + " seconds";
}

// Assign an avatar to an address
export const getAvatarFromAddress = (address) => {
  if (address === "") {
    return defaultAvatar;
  }
  const character = address.charAt(2);
  switch (character) {
    case "0":
    case "1":
    case "2":
      return avatar1;
      break;
    case "3":
    case "4":
    case "5":
      return avatar2;
      break;
    case "6":
    case "7":
      return avatar3;
      break;
    case "8":
    case "9":
      return avatar4;
      break;
    case "A":
    case "B":
      return avatar5;
      break;
    case "C":
    case "D":
      return avatar6;
      break;
    case "E":
    case "F":
      return avatar7;
      break;
    case "a":
    case "b":
      return avatar8;
      break;
    case "c":
    case "d":
      return avatar9;
      break;
    case "e":
    case "f":
      return avatar10;
      break;
    default:
      return defaultAvatar;
  }
};
