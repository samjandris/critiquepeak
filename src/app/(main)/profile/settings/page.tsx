'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Skeleton } from '@nextui-org/react';
import { useAuth } from '@/components/AuthProvider';
import { getUser, updateUser } from '@/lib/users';

export default function ProfileSettingsPage() {
  const { authLoaded, auth, user } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!user) return;

    getUser(user.id).then((res) => {
      if (!res) return;
      setFirstName(res.first_name);
      setLastName(res.last_name);
      setUsername(res.username);
    });
  }, [user]);

  return (
    <div className="flex flex-col justify-center items-center h-[90vh] gap-4">
      <h1 className="mt-1 text-4xl">Profile Settings</h1>
      <div className="grid grid-cols-2 gap-2">
        <Skeleton isLoaded={authLoaded} className="rounded-lg">
          <Input
            type="text"
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Skeleton>
        <Skeleton isLoaded={authLoaded} className="rounded-lg">
          <Input
            type="text"
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Skeleton>

        <Skeleton isLoaded={authLoaded} className="col-span-2 rounded-lg">
          <Input
            type="text"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Skeleton>

        <Button
          isDisabled={!authLoaded}
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
