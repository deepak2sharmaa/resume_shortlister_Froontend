// // import { clsx, type ClassValue } from 'clsx';
// // import { twMerge } from 'tailwind-merge';

// // export function cn(...inputs: ClassValue[]) {
// //   return twMerge(clsx(inputs));
// // }



// export const fakeApi = {
//   signUp: async (data: any) => {
//     // simulate network delay
//     await new Promise((res) => setTimeout(res, 600));
//     return { ok: true, message: "Signed up" };
//   },
//   login: async (username: string, password: string) => {
//     await new Promise((res) => setTimeout(res, 400));
//     // return success - in a real app validate
//     return { ok: true, needOtp: true, token: "fake_token" };
//   },
//   verifyOtp: async (otp: string) => {
//     await new Promise((res) => setTimeout(res, 400));
//     if (otp === "123456") return { ok: true };
//     return { ok: false, message: "Invalid OTP" };
//   },
//   sendOtpToEmail: async (email: string) => {
//     await new Promise((res) => setTimeout(res, 400));
//     return { ok: true, message: "OTP sent" };
//   },
//   resetPassword: async (email: string, otp: string, newPassword: string) => {
//     await new Promise((res) => setTimeout(res, 600));
//     if (otp === "123456") return { ok: true };
//     return { ok: false, message: "Invalid OTP" };
//   },
// };




import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
