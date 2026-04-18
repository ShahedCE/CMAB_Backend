export type DirectoryMemberAddedPayload = {
  memberId: string;
  joinRequestId: string | null;
  fullNameEn: string;
  email: string;
};

export type DirectoryMemberUpdatedPayload = { 
  memberId: string;
  joinRequestId: string | null;
  fullNameEn: string;
  email: string;
};

export type DirectoryMemberDeletedPayload = {
  memberId: string;
  joinRequestId: string | null;
  fullNameEn: string;
  email: string;
};