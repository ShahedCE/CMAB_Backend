export type JoinRequestCreatedPayload = {
  joinRequestId: string;
  fullNameEn: string;
  email: string;
  createdAt: Date;
};

export type JoinRequestApprovedPayload = {
  joinRequestId: string;
  memberId: string;
  fullNameEn: string;
  email: string;
  approvedAt: Date;
  approvedByAdminId: string | null;
};

export type JoinRequestRejectedPayload = {
  joinRequestId: string;
  fullNameEn: string;
  email: string;
  rejectedAt: Date;
  reason: string | null;
};