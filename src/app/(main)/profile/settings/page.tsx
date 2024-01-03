'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { Avatar, Button, Input, Skeleton } from '@nextui-org/react';
import { useAuth } from '@/components/AuthProvider';
import { getClient } from '@/lib/supabase';
import { getUser, updateUser } from '@/lib/users';

const supabase = getClient();

export default function ProfileSettingsPage() {
  const { auth, user } = useAuth();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;

    getUser(user.id).then((res) => {
      if (!res) return;
      setFirstName(res.first_name);
      setLastName(res.last_name);
      setUsername(res.username);
      setAvatar(res.avatar);
      setDataLoaded(true);
    });
  }, [user]);

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files![0];
    setAvatar(URL.createObjectURL(file));

    const { error } = await supabase.storage
      .from('avatars')
      .upload(`${user?.id}/profile.png`, file, {
        upsert: true,
      });

    if (error) {
      console.log(error);
      return;
    }
  }

  return (
    <div className="flex flex-col justify-center items-center h-[90vh] gap-4">
      <h1 className="mt-1 text-4xl">Profile Settings</h1>
      <div className="grid grid-cols-2 gap-2 w-72">
        <div className="col-span-2 mb-2 flex justify-center">
          <Skeleton isLoaded={dataLoaded} className="rounded-full">
            <Avatar
              size="lg"
              name={`${firstName.charAt(0)}${lastName.charAt(0)}`}
              src={avatar}
              isIconOnly
              as={Button}
              onPress={() => {
                uploadRef.current?.click();
              }}
            />
            <input
              ref={uploadRef}
              type="file"
              accept="image/*"
              hidden
              onChange={uploadAvatar}
            />
          </Skeleton>
        </div>

        <Skeleton isLoaded={dataLoaded} className="rounded-lg">
          <Input
            type="text"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Skeleton>
        <Skeleton isLoaded={dataLoaded} className="rounded-lg">
          <Input
            type="text"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Skeleton>

        <Skeleton isLoaded={dataLoaded} className="col-span-2 rounded-lg">
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Skeleton>

        <Button
          isDisabled={!dataLoaded}
          onPress={() => {
            updateUser(user!.id, {
              username,
              first_name: firstName,
              last_name: lastName,
            }).then(() => {
              // Refresh the session to update the user object
              // Note: This doesn't feel like the best way to do this
              auth.refreshSession();
            });
          }}
          className="col-span-2"
        >
          Update
        </Button>
      </div>
    </div>
  );
}
