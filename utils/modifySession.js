exports.functionName = function (session) {
  let response = Object.assign({}, session);
  delete response['startDate'];
  return response;
};
