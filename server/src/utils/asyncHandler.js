const asyncHandler = (execFunction) => {
  return (req, res, next) => {
    Promise.resolve(execFunction(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
