import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function HelpItem(props) {
  const { title, desc, url } = props;

  const [opened, setOpened] = useState(false);
  const handleSetIndex = () => setOpened(!opened);

  return (
    <div className="flex flex-col border border-border-color rounded-md bg-white shadow-sm mb-4">
      <div
        onClick={handleSetIndex}
        className={
          "flex flex-row items-center w-full justify-between py-3 px-4 bg-primary transition duration-300 cursor-pointer hover:bg-accent " +
          (opened ? "rounded-t-md" : "rounded-md")
        }
      >
        <div className="flex-auto pl-2">
          <div className="text-white font-semibold capitalize">{title}</div>
        </div>
        {opened ? (
          <ChevronUpIcon className="h-5 w-5 text-white ml-2" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-white ml-2" />
        )}
      </div>
      {opened && (
        <div className="bg-white px-4 pt-6 pb-7 text-sm">
          {desc.split("\n").map((str, idx) => (
            <p key={idx}>
              {str}
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary"
                >
                  guide.
                </a>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
