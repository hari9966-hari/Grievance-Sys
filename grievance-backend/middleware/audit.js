const AuditLog = require('../models/AuditLog');

/**
 * Creates an audit log entry for sensitive actions.
 * Call this helper from controllers after a successful operation.
 */
const createAuditLog = async ({
  req,
  action,
  entityType,
  entityId,
  before,
  after
}) => {
  try {
    if (!req.user) return;

    await AuditLog.create({
      actor: req.user._id,
      actorRole: req.user.role,
      action,
      entityType,
      entityId,
      before,
      after,
      metadata: {
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    });
  } catch (err) {
    // Do not block main request flow on audit failures
    console.error('Audit log error:', err.message);
  }
};

module.exports = {
  createAuditLog
};

