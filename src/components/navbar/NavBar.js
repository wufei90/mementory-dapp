import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { navigation } from "../../router/navigation";
import { CustomConnectButton } from "../button/CustomConnectButton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import logo from "../../assets/img/logo.png";

const NavBar = (props) => {
  const router = useRouter();

  const [menuActive, setMenuActive] = useState(null);

  const handleMenuActive = () => {
    setMenuActive(!menuActive);
  };

  const [activeIndex, setActiveIndex] = useState(null);
  const handleDropdown = (index) => {
    setActiveIndex(index);
  };

  return (
    <header className="fixed top-0 z-20 w-full border-b-2 border-border-color bg-white">
      <div className="flex justify-between items-center px-6 py-3 max-w-main mx-auto">
        <div className="-mb-1">
          <Link href="/">
            <a>
              <Image src={logo} alt="Mementory logo" width={176} height={36} />
            </a>
          </Link>
        </div>
        <div className="flex-1 px-10 justify-end hidden md:flex">
          {navigation.map((item) => (
            <Link href={item.href} key={item.name}>
              <a
                className={
                  "px-6 font-semibold hover:text-primary " +
                  (router.route === item.href
                    ? "text-primary"
                    : "text-subtitle-color")
                }
                aria-current={router.route === item.href ? "page" : undefined}
              >
                {item.name}
              </a>
            </Link>
          ))}
        </div>

        <nav
          id="main-nav"
          className={`flex flex-col flex-auto absolute w-3/5 top-0 left-0 my-0 mx-auto h-screen bg-white shadow-lg transition -translate-x-full z-[999999] sm:w-2/5 ${
            menuActive ? "translate-x-0" : ""
          }`}
        >
          {navigation.map((item) => (
            <Link href={item.href} key={item.name}>
              <a
                className={
                  "p-4 border-b border-b-border-color font-semibold text-sm hover:text-primary " +
                  (router.route === item.href
                    ? "text-primary"
                    : "text-subtitle-color")
                }
                aria-current={router.route === item.href ? "page" : undefined}
              >
                {item.name}
              </a>
            </Link>
          ))}
          <div className="px-3 my-6">
            <CustomConnectButton
              showBalance={false}
              accountStatus="address"
              chainStatus="none"
            />
          </div>
          <p className="text-xs px-3 text-subtitle-color uppercase">
            © 2022 Mementory by AXP3 Studio
          </p>
        </nav>

        <div className="flex flex-row items-center">
          <div className="hidden md:block">
            <CustomConnectButton
              showBalance={false}
              accountStatus="address"
              chainStatus="none"
            />
          </div>
          {menuActive ? (
            <XMarkIcon
              className={
                "h-8 w-8 text-title-color stroke-2 ml-4 cursor-pointer md:hidden"
              }
              onClick={handleMenuActive}
            />
          ) : (
            <Bars3Icon
              className={
                "h-8 w-8 text-title-color stroke-2 ml-4 cursor-pointer md:hidden"
              }
              onClick={handleMenuActive}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
