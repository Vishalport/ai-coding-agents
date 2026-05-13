/**
 * @description Strips sensitive fields from a user object before sending to client
 * @param {Object} user - raw user object from data.json
 * @returns {Object} safe user object without password
 */
const formatUser = (user) => {
  if (!user) throw new Error("formatUser: user is required");
  const { password, ...safe } = user;
  return safe;
};

module.exports = { formatUser };
