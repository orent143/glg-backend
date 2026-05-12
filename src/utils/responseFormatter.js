const formatResponse = (data, message = "Success") => {
  return {
    message,
    data,
  };
};

module.exports = formatResponse;