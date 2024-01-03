'use client';

import NextImage from 'next/image';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import {
  Spinner,
  Image,
  Skeleton,
  Card,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  Input,
} from '@nextui-org/react';
import UserChip from '@/components/user/UserChip';
import { useAuth } from '@/components/AuthProvider';

import { getClient } from '@/lib/supabase';
import {
  getUser,
  getFollowerCount,
  getUserByUsername,
  followUser,
  isUserFollowing,
  unfollowUser,
  updateUser,
} from '@/lib/users';

const supabase = getClient();

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const username = params.userId;
  const { authLoaded, auth, user } = useAuth();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('abcdefghijkl');
  const [avatar, setAvatar] = useState('');

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [authUserFollowing, setAuthUserFollowing] = useState(false);
  const [userFollowingAuth, setUserFollowingAuth] = useState(false);
  const [followButtonLoaded, setFollowButtonLoaded] = useState(false);

  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  useEffect(() => {
    getUserByUsername(username).then((res) => {
      if (res) {
        setUserId(res.id);
        setName(`${res.first_name} ${res.last_name}`);
        setAvatar(res.avatar);
        setFollowingCount(res.following.length);
        setFollowerCount(res.followers);
        setUserExists(true);

        if (user) {
          isUserFollowing(user.id, res.id).then((userFollowing) => {
            setAuthUserFollowing(userFollowing);
          });

          isUserFollowing(res.id, user.id).then((userFollows) => {
            setUserFollowingAuth(userFollows);
            setFollowButtonLoaded(true);
          });
        }
      }

      setDataLoaded(true);
    });
  }, [username, user]);

  return authLoaded && dataLoaded ? (
    userExists ? (
      <div className="grid grid-cols-4 gap-4 p-8">
        <div className="flex flex-col items-center gap-4">
          {dataLoaded && (
            <div className="">
              <Image
                as={NextImage}
                src={avatar}
                alt={'Profile picture for ' + username}
                width={200}
                height={200}
                sizes="100vw"
                shadow="md"
                isBlurred
                isLoading={!dataLoaded}
                radius="full"
                className="w-full h-auto"
              />
            </div>
          )}

          <Skeleton isLoaded={dataLoaded}>
            <div className="text-center">
              <h1 className="text-3xl font-bold">{name}</h1>
              <div className="flex justify-center items-center gap-3">
                <p className="text-gray-500 leading-tight">@{username}</p>
                {userFollowingAuth && (
                  <Chip size="sm" variant="flat">
                    Follows You
                  </Chip>
                )}
              </div>
            </div>
          </Skeleton>

          <Skeleton isLoaded={dataLoaded}>
            <div className="flex gap-2">
              <Button variant="light" size="sm">
                {followerCount + ' Followers'}
              </Button>
              <Button
                variant="light"
                size="sm"
                onPress={() => setFollowingModalOpen(!followingModalOpen)}
              >
                {followingCount + ' Following'}
              </Button>
            </div>
          </Skeleton>

          <Skeleton isLoaded={dataLoaded}>
            {user &&
              (user.id === userId ? (
                <>
                  <Button
                    onPress={() =>
                      setEditProfileModalOpen(!editProfileModalOpen)
                    }
                    className="w-full"
                  >
                    Edit Profile
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  isLoading={!followButtonLoaded}
                  onPress={() => {
                    console.log('Follow user', userId);
                    if (authUserFollowing) {
                      unfollowUser(user.id, userId);
                      setFollowerCount(followerCount - 1);
                      setAuthUserFollowing(false);
                    } else {
                      followUser(user.id, userId);
                      setFollowerCount(followerCount + 1);
                      setAuthUserFollowing(true);
                    }
                  }}
                  className="w-full"
                >
                  {followButtonLoaded
                    ? authUserFollowing
                      ? 'Unfollow'
                      : 'Follow'
                    : ''}
                </Button>
              ))}
          </Skeleton>
        </div>

        <UserListModal
          type="following"
          userId={userId}
          isOpen={followingModalOpen}
          setOpen={setFollowingModalOpen}
        />
        <UserListModal
          type="followers"
          userId={userId}
          isOpen={followersModalOpen}
          setOpen={setFollowersModalOpen}
        />

        <EditProfileModal
          isOpen={editProfileModalOpen}
          setOpen={setEditProfileModalOpen}
        />
      </div>
    ) : (
      <div className="flex justify-center items-center h-[90vh]">
        <Card>
          <CardBody>
            <p>User does not exist.</p>
          </CardBody>
        </Card>
      </div>
    )
  ) : (
    <div className="flex justify-center items-center h-[90vh]">
      <Spinner color="default" size="lg" />
    </div>
  );
}

function UserListModal({
  type,
  userId,
  isOpen,
  setOpen,
}: {
  type: string;
  userId: string;
  isOpen: boolean;
  setOpen: any;
}) {
  const [userList, setUserList] = useState<string[] | null>([]);

  useEffect(() => {
    if (type === 'following') {
      getUser(userId).then((res) => {
        if (!res) return;
        setUserList(res.following);
      });
    } else {
      // TODO: Get followers
      // getFollowers(userId).then((res) => {
      //   if (!res) return;
      //   setUserList(res);
      // });
    }
  }, [type, userId]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={() => setOpen(!isOpen)}
      className="max-w-[350px]"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {type === 'following' ? 'Following' : 'Followers'}
            </ModalHeader>
            <ModalBody>
              {userList?.map((userId) => (
                <UserChip key={userId} userId={userId} />
              ))}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function EditProfileModal({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: any;
}) {
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
  }, [user, isOpen]);

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
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={() => setOpen(!isOpen)}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Profile
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-2 gap-2">
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

                <Skeleton
                  isLoaded={dataLoaded}
                  className="col-span-2 rounded-lg"
                >
                  <Input
                    type="text"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Skeleton>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="primary"
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

                  onClose();
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
function getFollowers(userId: string) {
  throw new Error('Function not implemented.');
}
