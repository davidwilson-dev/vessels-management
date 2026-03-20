import { AuditLog } from "#/models/auditLog.model.js";

const create = (data) => {
  return AuditLog.create(data);
};

export const auditLogRepo = {
  create
}