'use client';

import { Tabs, Tab } from '@nextui-org/react';
import PersonCarousel from '@/components/cast/CastCarousel';
import { CastPerson, CrewPerson } from '@/lib/types';

export default function CastCrew({
  cast,
  crew,
}: {
  cast: CastPerson[];
  crew: CrewPerson[];
}) {
  return (
    <div className="text-center">
      <Tabs size="lg" variant="underlined">
        <Tab key="cast" title="Cast" className="flex justify-center">
          <PersonCarousel type="cast" items={cast} />
        </Tab>

        <Tab key="crew" title="Crew" className="flex justify-center">
          <PersonCarousel type="crew" items={crew} />
        </Tab>
      </Tabs>
    </div>
  );
}
