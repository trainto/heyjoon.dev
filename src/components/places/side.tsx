import { useAuthState } from '@/lib/hooks';
import Signin from './signin';
import TopTags from './top-tags';
import User from './user';

const Side = () => {
  const authIconKind = useAuthState();

  return (
    <div className="hidden sm:block sm:sticky sm:top-20 border border-gray-700 p-3 rounded">
      <div>
        {authIconKind === 'avatar' ? (
          <div>
            <User />
          </div>
        ) : authIconKind === 'google' ? (
          <Signin width={170} from="side" />
        ) : null}
      </div>

      <div className="text-xl font-bold mt-3 border-t border-gray-500 pt-3">Top tags:</div>
      <div className="mt-1 px-1 text-sm">
        <TopTags />
      </div>
    </div>
  );
};

export default Side;
