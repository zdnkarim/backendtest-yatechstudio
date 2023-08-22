const response = (status, data, message, res) => {
  res.status(status).json({
    payload: data,
    message: message,
  });
};

export default response