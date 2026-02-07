const mongoose = require('mongoose');
const { Log } = require('../models/Log');

const getLogs = async (_req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: logs });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch logs', error: error.message });
  }
};

const getLogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid log id' });
    }

    const log = await Log.findById(id);

    if (!log) {
      return res.status(404).json({ message: 'Log not found' });
    }

    return res.status(200).json({ data: log });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch log', error: error.message });
  }
};

const clearLogs = async (_req, res) => {
  try {
    const result = await Log.deleteMany({});
    return res.status(200).json({
      message: 'Logs cleared successfully',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to clear logs', error: error.message });
  }
};

module.exports = {
  getLogs,
  getLogById,
  clearLogs
};
