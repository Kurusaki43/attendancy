export type ServiceRotateAttendanceQrResult = {
  token: string;
  qrDataUrl: string;
  issuedAt: number;
  expiresInMs: number;
};

export type ServiceVerifyAttendanceQrResult = {
  valid: true;
};
