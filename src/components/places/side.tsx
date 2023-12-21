import useStore from '@/lib/store';
import TopTags from './top-tags';
import User from './user';
import Signin from './signin';

const Side = () => {
  const { value: userInfo, dispatch: dispatchUserInfo } = useStore('userInfo');

  return (
    <div className="hidden sm:block sm:sticky sm:top-20 border border-gray-700 p-3 rounded">
      <div>
        {userInfo ? (
          <div>
            <User />
          </div>
        ) : (
          <Signin width={170} from="side" />
        )}
      </div>

      <div className="text-xl font-bold mt-3 border-t border-gray-500 pt-3">Top tags:</div>
      <div className="mt-1 px-1 text-sm">
        <TopTags />
      </div>
    </div>
  );
};

export default Side;
