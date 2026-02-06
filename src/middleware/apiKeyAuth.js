const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const apiKeyAuth = (req, res, next) => {
  if (!MUTATION_METHODS.has(req.method)) {
    return next();
  }

  const configuredKey = process.env.API_KEY;
  const providedKey = req.header('x-api-key');

  if (!configuredKey || providedKey !== configuredKey) {
    return res.status(401).json({ message: 'Invalid API key.' });
  }

  return next();
};

module.exports = apiKeyAuth;
