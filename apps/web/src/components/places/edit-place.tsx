import { sendRequest } from '@/lib/api/fetchers';
import { dispatchEvent } from '@/lib/event-bus';
import { dispatch, getCached } from '@/lib/store';
import { useEffect, useRef, useState } from 'react';
import Button from '../common/button';
import Loading from './loading';
import { DescField, LocationField } from './place-fields';

export default function EditPlace({ place }: { place: Place }) {
  const [desc, setDesc] = useState(place.desc);
  const [location, setLocation] = useState<PlaceLocation | null>(place.location ?? null);
  const [isSaving, setIsSaving] = useState(false);

  // Unique per mount (not just per place id), so re-opening the same place's
  // editor while a previous save for it is still in flight doesn't let that
  // stale request close this newer instance.
  const editKey = useRef(`edit-place-${place.id}-${Date.now()}-${Math.random()}`).current;

  useEffect(() => {
    const current = getCached('layer');
    if (current) {
      dispatch('layer', { ...current, key: editKey });
    }
    // Only tag the layer that's open right now with our key; it's already
    // showing this editor's node by the time this effect runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (desc.trim() === '' || isSaving) {
      return;
    }

    setIsSaving(true);

    const res = await sendRequest({
      method: 'PATCH',
      url: '/places/' + place.id,
      data: { desc: desc.trim(), location },
    });

    if (res.status === 200) {
      // The user may have closed this editor and opened another place's
      // editor while this request was in flight -- only clear the global
      // layer if it's still showing this one, so we don't close (and
      // discard the draft of) whatever is open now.
      if (getCached('layer')?.key === editKey) {
        dispatch('layer', null);
      }
      dispatchEvent('fetchPlaces');
    } else {
      dispatch('modal', { msg: 'Failed to save. Please try again.' });
    }

    setIsSaving(false);
  };

  return (
    <div className="p-3">
      <DescField desc={desc} onDescChange={setDesc} disabled={isSaving} />

      <div className="mt-2">
        <LocationField
          location={location}
          onLocationChange={setLocation}
          variant="inline"
          disabled={isSaving}
        />
      </div>

      <div className="flex justify-end mt-3 pt-2 border-t border-gray-600">
        {isSaving ? (
          <div className="px-4 pt-1">
            <Loading size={5} />
          </div>
        ) : (
          <Button size="sm" color="indigo" onClick={handleSave} disabled={desc.trim() === ''}>
            Save
          </Button>
        )}
      </div>
    </div>
  );
}
