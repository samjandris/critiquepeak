'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
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
  Image,
} from '@nextui-org/react';
import UserChip from '@/components/user/UserChip';
import { useAuth } from '@/components/AuthProvider';

import { getClient } from '@/lib/supabase';
import {
  getUserIdByUsername,
  getUser,
  isUserFollowing,
  followUser,
  unfollowUser,
  getFollowingIds,
  getFollowerIds,
  updateUser,
} from '@/lib/users';
import { truncateNumber } from '@/lib/misc';

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

  const {
    data: userId,
    error: userIdError,
    isLoading: userIdIsLoading,
  } = useSWR(username ? ['user', username] : null, () =>
    getUserIdByUsername(username)
  );

  const {
    data: userData,
    error: userDataError,
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
  } = useSWR(['user', user?.id], () => user && getUser(user.id));

  const {
    data: isUserFollowingAuth,
    error: userFollowingAuthError,
    isLoading: userFollowingAuthIsLoading,
  } = useSWR(['isFollowing', userId, user?.id], () => {
    if (!userId || !user) return;
    return isUserFollowing(userId, user.id);
  });

  const {
    data: isAuthFollowingUser,
    error: authFollowingUserError,
    isLoading: authFollowingUserIsLoading,
    mutate: mutateAuthFollowingUser,
  } = useSWR(['isFollowing', user?.id, userId], () => {
    if (!user || !userId) return;
    return isUserFollowing(user.id, userId);
  });

  if (
    userIdIsLoading ||
    userDataIsLoading ||
    authUserDataIsLoading ||
    userFollowingAuthIsLoading ||
    authFollowingUserIsLoading
  ) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Spinner color="default" size="lg" />
      </div>
    );
  }

  if (authUserError || userFollowingAuthError || authFollowingUserError) {
    return (
      <div className="flex justify-center items-center h-[90vh]">
        <Card>
          <CardBody>
            <p>{userIdError?.message}</p>
            <p>{userDataError?.message}</p>
            <p>{authUserError?.message}</p>
            <p>{userFollowingAuthError?.message}</p>
            <p>{authFollowingUserError?.message}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (userIdError || userDataError || !userData) {
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
          <Avatar
            isBordered
            src={userData.avatar}
            name={userData.initials}
            showFallback
            className="w-[100px] h-[100px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] text-7xl"
          />

          <div className="text-center">
            <h1 className="text-3xl font-bold">
              {userData.first_name} {userData.last_name}
            </h1>
            <div className="flex justify-center items-center gap-3">
              <p className="text-default-500 leading-tight">
                @{userData.username}
              </p>
              {isUserFollowingAuth && (
                <Chip size="sm" variant="flat">
                  Follows You
                </Chip>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="light"
              size="sm"
              onPress={() => setFollowersModalOpen(!followersModalOpen)}
            >
              {truncateNumber(userData.follower_count) + ' Followers'}
            </Button>
            <Button
              variant="light"
              size="sm"
              onPress={() => setFollowingModalOpen(!followingModalOpen)}
            >
              {truncateNumber(userData.following_count) + ' Following'}
            </Button>
          </div>

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
                    if (isAuthFollowingUser) {
                      unfollowUser(authUserData.id, userData.id);

                      mutateAuthFollowingUser(false); // update follow state client side
                      mutateUser({
                        ...userData,
                        follower_count: userData.follower_count - 1, // update follower count client side
                      });
                    } else {
                      followUser(authUserData.id, userData.id);

                      mutateAuthFollowingUser(true); // update follow state client side
                      mutateUser({
                        ...userData,
                        follower_count: userData.follower_count + 1, // update follower count client side
                      });
                    }
                  }
                }}
                className="w-full"
              >
                {isAuthFollowingUser ? 'Unfollow' : 'Follow'}
              </Button>
            )
          )}
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
  } = useSWR([type + 'Ids', userId], () => {
    if (type === 'following') {
      return getFollowingIds(userId);
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

                  {/*
                  TODO: This should be more performant
                  {userList &&
                    userList.map((user) => (
                      <UserChip
                        key={user.id}
                        user={user}
                        isUser={false}
                        isFollowing={false}
                        onFollowChange={() => {
                          console.log('follow change');
                        }}
                      />
                    ))}
                  */}
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
      console.error(error);
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
                        as={Button}
                        isBordered
                        isIconOnly
                        size="lg"
                        src={avatar ? avatar : authUserData.avatar}
                        name={authUserData.initials}
                        showFallback
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
                      size="lg"
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
                      size="lg"
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
                      size="lg"
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
