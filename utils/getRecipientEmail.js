const getRecipientEmail = function (users, userLoggedIn) {
  return users?.filter((user) => user !== userLoggedIn?.email)[0];
};

export default getRecipientEmail;
