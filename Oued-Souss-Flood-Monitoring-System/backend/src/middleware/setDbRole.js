module.exports = async function setDbRole(req, client) {

  if (!req.user?.role)
    throw new Error("User role missing");

  await client.query(
    `SET LOCAL ROLE app_${req.user.role}`
  );

};
