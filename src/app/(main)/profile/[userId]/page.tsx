'use client';

import Image from 'next/image';

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import useSWR from 'swr';
import {
  Spinner,
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
  getUserIdByUsername,
  getUser,
  followUser,
  unfollowUser,
  updateUser,
  getFollowerIds,
} from '@/lib/users';

const supabase = getClient();

export default function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const username = params.userId;
  const { user } = useAuth();

  const [followingModalOpen, setFollowingModalOpen] = useState(false);
  const [followersModalOpen, setFollowersModalOpen] = useState(false);
  const [editProfileModalOpen, setEditProfileModalOpen] = useState(false);

  const { data: userId, isLoading: userIdIsLoading } = useSWR(
    username ? ['user', username] : null,
    () => getUserIdByUsername(username)
  );

  const {
    data: userData,
    error: userError,
    isLoading: userDataIsLoading,
    mutate: mutateUser,
  } = useSWR(userId && ['user', userId], () => {
    if (!userId) return;
    return getUser(userId);
  });

  const {
    data: authUserData,
    error: authUserError,
    isLoading: authUserDataIsLoading,
    mutate: mutateAuthUser,
  } = useSWR(['user', user?.id], () => user && getUser(user.id));

  if (userIdIsLoading || userDataIsLoading || authUserDataIsLoading) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  if (userError || authUserError) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Card>
          <CardBody>
            <p>{userError?.message}</p>
            <p>{authUserError?.message}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Card>
          <CardBody>
            <p>User not found.</p>
          </CardBody>
        </Card>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-4 gap-4 p-8">
        <div className="flex flex-col items-center gap-4">
          <Skeleton
            isLoaded={!userDataIsLoading}
            className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full shadow-md shadow-black"
          >
            <Image
              src={userData.avatar}
              alt={'Profile picture for ' + userData.username}
              fill
              className="object-cover"
            />
          </Skeleton>

          <Skeleton isLoaded={!userDataIsLoading}>
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                {userData.first_name} {userData.last_name}
              </h1>
              <div className="flex justify-center items-center gap-3">
                <p className="text-gray-500 leading-tight">
                  @{userData.username}
                </p>
                {authUserData &&
                  userData.following.includes(authUserData.id) && (
                    <Chip size="sm" variant="flat">
                      Follows You
                    </Chip>
                  )}
              </div>
            </div>
          </Skeleton>

          <Skeleton isLoaded={!userDataIsLoading}>
            <div className="flex gap-2">
              <Button
                variant="light"
                size="sm"
                onPress={() => setFollowersModalOpen(!followersModalOpen)}
              >
                {userData.followers + ' Followers'}
              </Button>
              <Button
                variant="light"
                size="sm"
                onPress={() => setFollowingModalOpen(!followingModalOpen)}
              >
                {userData.following.length + ' Following'}
              </Button>
            </div>
          </Skeleton>

          <Skeleton isLoaded={!userDataIsLoading}>
            {authUserData && userData.id === authUserData.id ? (
              <>
                <Button
                  size="sm"
                  onPress={() => setEditProfileModalOpen(!editProfileModalOpen)}
                  className="w-full"
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              authUserData && (
                <Button
                  size="sm"
                  onPress={() => {
                    if (authUserData) {
                      if (authUserData.following.includes(userData.id)) {
                        unfollowUser(authUserData.id, userData.id);
                        mutateAuthUser({
                          ...authUserData,
                          following: authUserData.following.filter(
                            (id) => id !== userData.id
                          ),
                        });
                        mutateUser({
                          ...userData,
                          followers: userData.followers - 1,
                        });
                      } else {
                        followUser(authUserData.id, userData.id);
                        mutateAuthUser({
                          ...authUserData,
                          following: [...authUserData.following, userData.id],
                        });
                        mutateUser({
                          ...userData,
                          followers: userData.followers + 1,
                        });
                      }
                    }
                  }}
                  className="w-full"
                >
                  {authUserData && authUserData.following.includes(userData.id)
                    ? 'Unfollow'
                    : 'Follow'}
                </Button>
              )
            )}
          </Skeleton>
        </div>

        <UserListModal
          type="following"
          userId={userData.id}
          isOpen={followingModalOpen}
          setOpen={setFollowingModalOpen}
        />
        <UserListModal
          type="followers"
          userId={userData.id}
          isOpen={followersModalOpen}
          setOpen={setFollowersModalOpen}
        />

        <EditProfileModal
          isOpen={editProfileModalOpen}
          setOpen={setEditProfileModalOpen}
        />
      </div>
    );
  }
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
  const {
    data: userList,
    error: userListError,
    isLoading: userListIsLoading,
  } = useSWR([type, userId], () => {
    if (type === 'following') {
      return getUser(userId).then((res) => {
        return res.following;
      });
    } else {
      return getFollowerIds(userId);
    }
  });

  if (userListIsLoading) {
    return (
      <Modal isOpen={isOpen} onOpenChange={() => setOpen(!isOpen)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === 'following' ? 'Following' : 'Followers'}
              </ModalHeader>
              <ModalBody>
                <div className="flex justify-center items-center">
                  <Spinner color="default" size="lg" />
                </div>
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

  if (userListError) {
    return (
      <Modal isOpen={isOpen} onOpenChange={() => setOpen(!isOpen)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {type === 'following' ? 'Following' : 'Followers'}
              </ModalHeader>
              <ModalBody>
                <p className="text-center">{userListError.message}</p>
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

  if (userList) {
    if (userList.length === 0) {
      return (
        <Modal isOpen={isOpen} onOpenChange={() => setOpen(!isOpen)}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {type === 'following' ? 'Following' : 'Followers'}
                </ModalHeader>
                <ModalBody>
                  <p className="text-center">
                    {type === 'following'
                      ? 'This user is not following anyone.'
                      : 'This user has no followers.'}
                  </p>
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
    } else {
      return (
        <Modal isOpen={isOpen} onOpenChange={() => setOpen(!isOpen)}>
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
  }
}

function EditProfileModal({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: any;
}) {
  const { user } = useAuth();

  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const {
    data: authUserData,
    error: authUserError,
    isLoading: authUserDataIsLoading,
    mutate: mutateAuthUser,
  } = useSWR(['user', user?.id], () => user && getUser(user.id));

  useEffect(() => {
    if (!authUserData) return;

    setAvatar(authUserData.avatar);
    setUsername(authUserData.username);
    setFirstName(authUserData.first_name);
    setLastName(authUserData.last_name);
  }, [authUserData, isOpen]);

  const uploadRef = useRef<HTMLInputElement>(null);

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

  if (authUserDataIsLoading) {
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
                <div className="flex justify-center items-center">
                  <Spinner color="default" size="lg" />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  if (authUserError) {
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
                <p className="text-center">{authUserError.message}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }

  if (!authUserData) {
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
                <p className="text-center">User not found.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  } else {
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
                    <Skeleton
                      isLoaded={!authUserDataIsLoading}
                      className="rounded-full"
                    >
                      <Avatar
                        size="lg"
                        name={`${firstName?.charAt(0)}${lastName?.charAt(0)}`}
                        src={avatar ? avatar : authUserData.avatar}
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

                  <Skeleton
                    isLoaded={!authUserDataIsLoading}
                    className="rounded-lg"
                  >
                    <Input
                      type="text"
                      label="First Name"
                      value={firstName || ''}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </Skeleton>
                  <Skeleton
                    isLoaded={!authUserDataIsLoading}
                    className="rounded-lg"
                  >
                    <Input
                      type="text"
                      label="Last Name"
                      value={lastName || ''}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </Skeleton>

                  <Skeleton
                    isLoaded={!authUserDataIsLoading}
                    className="col-span-2 rounded-lg"
                  >
                    <Input
                      type="text"
                      label="Username"
                      value={username || ''}
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
                      username: username!,
                      first_name: firstName!,
                      last_name: lastName!,
                    }).then(() => {
                      mutateAuthUser({
                        ...authUserData,
                        username: username!,
                        first_name: firstName!,
                        last_name: lastName!,
                      });
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
}
