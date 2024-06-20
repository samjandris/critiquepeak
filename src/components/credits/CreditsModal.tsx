import { useMeasure } from '@uidotdev/usehooks';

import {
  Modal,
  ModalContent,
  ModalBody,
  Tabs,
  Tab,
  ScrollShadow,
  Avatar,
} from '@nextui-org/react';

import { CastPerson, CrewPerson } from '@/lib/types';
import { useEffect, useMemo } from 'react';
import { getInitials } from '@/lib/misc';

export default function CreditsModal({
  cast,
  crew,
  isOpen,
  onOpenChange,
}: {
  cast: CastPerson[];
  crew: CrewPerson[];
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  const [modalRef, { width: modalWidth, height: modalHeight }] = useMeasure();
  const [tabsRef, { width: tabsWidth }] = useMeasure();

  const crewDepartments = useMemo(() => {
    const departments: { [department: string]: CrewPerson[] } = {};

    crew.map((crewMember) => {
      if (!departments[crewMember.department]) {
        departments[crewMember.department] = [];
      }

      const existingMember = departments[crewMember.department].find(
        (member) => member.id === crewMember.id
      );

      if (existingMember) {
        if (existingMember.job.includes(crewMember.job)) return;

        existingMember.job += ' / ' + crewMember.job;
      } else {
        departments[crewMember.department].push(crewMember);
      }
    });

    return departments;
  }, [crew]);

  useEffect(() => {
    if (isOpen) {
      document
        .getElementById('critiquepeak-root')
        ?.setAttribute('data-modal-open', '');
    } else {
      document
        .getElementById('critiquepeak-root')
        ?.removeAttribute('data-modal-open');
    }
  }, [isOpen]);

  return (
    <Modal
      ref={modalRef}
      placement="bottom"
      size="full"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'anticipate',
            },
          },
          exit: {
            y: '100%',
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn',
            },
          },
        },
      }}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="h-[80%] max-w-screen-2xl"
    >
      <ModalContent>
        <ModalBody>
          <div className="p-8">
            <Tabs
              ref={tabsRef}
              isVertical
              size="lg"
              variant="bordered"
              className="flex justify-center items-center"
            >
              <Tab key="cast" title="Cast" className="flex">
                <ScrollShadow
                  style={{
                    width: `calc(${modalWidth}px - ${tabsWidth}px - 10rem)`,
                    height: `calc(${modalHeight}px - 4.5rem)`,
                  }}
                  className="flex flex-col gap-4 ml-8"
                >
                  {cast.map((castMember) => (
                    <div
                      key={castMember.id}
                      className="flex items-center gap-4"
                    >
                      <Avatar
                        src={castMember.avatar}
                        name={getInitials(castMember.name)}
                        showFallback
                        className="w-28 h-28 text-3xl rounded-full"
                      />
                      <div>
                        <h4>{castMember.name}</h4>
                        <h5 className="text-text-700">
                          as {castMember.character}
                        </h5>
                      </div>
                    </div>
                  ))}
                </ScrollShadow>
              </Tab>

              {Object.keys(crewDepartments).map((category) => (
                <Tab key={category} title={category}>
                  <ScrollShadow
                    style={{
                      width: `calc(${modalWidth}px - ${tabsWidth}px - 10rem)`,
                      height: `calc(${modalHeight}px - 4.5rem)`,
                    }}
                    className="flex flex-col gap-4 ml-8 w-full"
                  >
                    {crewDepartments[category].map((crewMember: CrewPerson) => (
                      <div
                        key={crewMember.id}
                        className="flex items-center gap-4"
                      >
                        <Avatar
                          src={crewMember.avatar}
                          name={getInitials(crewMember.name)}
                          showFallback
                          className="w-28 h-28 text-3xl rounded-full"
                        />
                        <div>
                          <h4>{crewMember.name}</h4>
                          <h5 className="text-text-700">{crewMember.job}</h5>
                        </div>
                      </div>
                    ))}
                  </ScrollShadow>
                </Tab>
              ))}
            </Tabs>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
