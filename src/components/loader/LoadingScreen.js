import Loader from "./Loader";

export default function LoadingScreen(props) {
  const { message } = props;
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-70 flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center text-white text-sm">
        <Loader message={message} />
      </div>
    </div>
  );
}
