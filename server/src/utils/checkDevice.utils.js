import { UAParser } from "ua-parser-js";

const getDeviceInfo = (req) => {
  const parser = new UAParser(req.headers["user-agent"]);
  const ua = parser.getResult();

  return {
    browser: ua.browser.name ?? "unknown",
    browserVersion: ua.browser.version ?? "unknown",
    os: ua.os.name ?? "unknown",
    osVersion: ua.os.version ?? "unknown",
    deviceType: ua.device.type ?? "unknown",
    userAgent: req.headers["user-agent"] ?? "unknown"
  };
};

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    req.ip ||
    "unknown"
  );
};

export const checkDevice = {
  getDeviceInfo,
  getClientIp
};