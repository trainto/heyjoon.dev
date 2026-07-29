export default function PlaceLoading() {
  return (
    <>
      <div className="border border-gray-700 py-2 px-1 rounded">
        <div className="flex justify-between items-center px-1">
          <div>
            <div className="bg-gray-700 rounded-full w-8 h-8 animate-pulse" />
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500 rounded-md w-32 h-8 bg-gray-700 animate-pulse"></div>
          </div>
        </div>

        <div className="relative bg-gray-700 w-full pt-100 mt-2 rounded-md animate-pulse">
          <div className="place-images absolute top-0 right-0 bottom-0 left-0 grid content-center">
            <div />
          </div>
        </div>

        <div className="w-full h-8 bg-gray-700 mt-2 rounded-md animate-pulse"></div>
      </div>

      <div className="border border-gray-700 py-2 px-1 rounded mt-3">
        <div className="flex justify-between items-center px-1">
          <div>
            <div className="bg-gray-700 rounded-full w-8 h-8 animate-pulse" />
          </div>
          <div className="flex items-center space-x-1">
            <div className="text-xs text-gray-500 rounded-md w-32 h-8 bg-gray-700 animate-pulse"></div>
          </div>
        </div>

        <div className="relative bg-gray-700 w-full pt-100 mt-2 rounded-md animate-pulse">
          <div className="place-images absolute top-0 right-0 bottom-0 left-0 grid content-center">
            <div />
          </div>
        </div>

        <div className="w-full h-8 bg-gray-700 mt-2 rounded-md animate-pulse"></div>
      </div>
    </>
  );
}
