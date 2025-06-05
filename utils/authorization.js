export const canAccessSubscription = (subscription, reqUser) => {
  if (!subscription || !reqUser) return false;

  const userId = reqUser._id?.toString();
  const ownerId = subscription.user?._id?.toString();

  const isOwner = userId && ownerId && userId === ownerId;
  const isAdmin = reqUser.isAdmin === true;

  return isOwner || isAdmin;
};
