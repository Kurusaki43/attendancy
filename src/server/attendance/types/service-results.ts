export type ServiceRotateAttendanceQrResult = {
  token: string;
  qrDataUrl: string;
  issuedAt: number;
  expiresInMs: number;
};
