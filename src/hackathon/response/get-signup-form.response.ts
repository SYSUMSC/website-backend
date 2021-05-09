export interface GetSignupFormResponse {
  confirmed: boolean;
  teamInfo: {
    name: string;
    description: string;
  };
  memberInfo: {
    isCaptain: boolean;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
    school: string;
    educationalBackground: string;
    grade: string;
    major: string;
    experience: string;
  }[];
}
