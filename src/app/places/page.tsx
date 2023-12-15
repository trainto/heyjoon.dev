import Feed from '@/components/places/feed';

export default function Places() {
  return (
    <div className="flex flex-col sm:flex-row justify-center">
      <Feed />

      <div>
        <div className="sm:sticky sm:top-10">haha</div>
      </div>
    </div>
  );
}
