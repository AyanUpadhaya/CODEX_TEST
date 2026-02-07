const mongoose = require('mongoose');
const { Log } = require('../models/Log');

const toObjectId = (value) => {
  if (!value) {
    return undefined;
  }

  if (value instanceof mongoose.Types.ObjectId) {
    return value;
  }

  if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }

  return undefined;
};

const buildActor = (actor = {}) => {
  const actorId = toObjectId(actor.id || actor.sub || actor._id);

  return {
    id: actorId,
    name: actor.name || '',
    email: actor.email || '',
    role: actor.role || ''
  };
};

const createLog = async ({ type, message, actor, metadata = {} }) => {
  return Log.create({
    type,
    message,
    actor: buildActor(actor),
    metadata
  });
};

const createLogSafe = async (payload) => {
  try {
    await createLog(payload);
  } catch (error) {
    console.error('Failed to store activity log:', error.message);
  }
};

module.exports = {
  createLog,
  createLogSafe
};
