

// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { validateOTP, validatePasswordMatch, validateRequired, User } from '@/lib/validations';

// interface OTPModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   type: 'login' | 'reset';
//   email?: string;
//   onSuccess: () => void;
// }

// export default function OTPModal({ isOpen, onClose, type, email, onSuccess }: OTPModalProps) {
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleVerify = async () => {
//     setError('');
//     setIsLoading(true);

//     // Validate OTP
//     if (!validateOTP(otp)) {
//       setError('Please enter a valid 6-digit OTP');
//       setIsLoading(false);
//       return;
//     }

//     // For password reset, validate new password fields
//     if (type === 'reset') {
//       if (!validateRequired(newPassword)) {
//         setError('New password is required');
//         setIsLoading(false);
//         return;
//       }
//       if (!validatePasswordMatch(newPassword, confirmPassword)) {
//         setError('Passwords do not match');
//         setIsLoading(false);
//         return;
//       }
//     }

//     // Mock OTP verification (accept "123456" or any 6-digit number)
//     setTimeout(() => {
//       if (otp === '123456' || validateOTP(otp)) {
//         if (type === 'reset') {
//           // Save new password to localStorage
//           const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
//           const userIndex = users.findIndex((u: User) => u.email === email);
//           if (userIndex !== -1) {
//             users[userIndex].password = newPassword;
//             localStorage.setItem('users', JSON.stringify(users));
//           }
//         }
//         onSuccess();
//         onClose();
//         resetForm();
//       } else {
//         setError('Invalid OTP. Use 123456 for demo.');
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleResendOTP = () => {
//     setError('');
//     // Mock resend OTP
//     alert('OTP resent successfully! Use 123456 for demo.');
//   };

//   const resetForm = () => {
//     setOtp('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {type === 'login' ? 'Verify OTP' : 'Reset Password'}
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           {type === 'reset' && email && (
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 disabled
//                 className="bg-gray-50"
//               />
//             </div>
//           )}
          
//           <div>
//             <Label htmlFor="otp">Enter OTP</Label>
//             <Input
//               id="otp"
//               type="text"
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//               maxLength={6}
//             />
//             <p className="text-sm text-gray-500 mt-1">Use 123456 for demo</p>
//           </div>

//           {type === 'reset' && (
//             <>
//               <div>
//                 <Label htmlFor="newPassword">New Password</Label>
//                 <Input
//                   id="newPassword"
//                   type="password"
//                   placeholder="Enter new password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//             </>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex flex-col space-y-2">
//             <Button 
//               onClick={handleVerify} 
//               disabled={isLoading}
//               className="w-full"
//             >
//               {isLoading ? 'Verifying...' : (type === 'login' ? 'Verify OTP' : 'Reset Password')}
//             </Button>
            
//             {type === 'login' && (
//               <Button 
//                 variant="outline" 
//                 onClick={handleResendOTP}
//                 className="w-full"
//               >
//                 Resend OTP
//               </Button>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }




// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { validateOTP, validatePasswordMatch, validateRequired, User } from '@/lib/validations';

// interface OTPModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   type: 'login' | 'reset' | 'verify';
//   email?: string;
//   onSuccess: () => void;
// }

// export default function OTPModal({ isOpen, onClose, type, email, onSuccess }: OTPModalProps) {
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleVerify = async () => {
//     setError('');
//     setIsLoading(true);

//     // Validate OTP
//     if (!validateOTP(otp)) {
//       setError('Please enter a valid 6-digit OTP');
//       setIsLoading(false);
//       return;
//     }

//     // For password reset, validate new password fields
//     if (type === 'reset') {
//       if (!validateRequired(newPassword)) {
//         setError('New password is required');
//         setIsLoading(false);
//         return;
//       }
//       if (!validatePasswordMatch(newPassword, confirmPassword)) {
//         setError('Passwords do not match');
//         setIsLoading(false);
//         return;
//       }
//     }

//     // Mock OTP verification (accept "123456" or any 6-digit number)
//     setTimeout(() => {
//       if (otp === '123456' || validateOTP(otp)) {
//         if (type === 'reset') {
//           // Save new password to localStorage
//           const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
//           const userIndex = users.findIndex((u: User) => u.email === email);
//           if (userIndex !== -1) {
//             users[userIndex].password = newPassword;
//             localStorage.setItem('users', JSON.stringify(users));
//           }
//         }
//         onSuccess();
//         onClose();
//         resetForm();
//       } else {
//         setError('Invalid OTP. Use 123456 for demo.');
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleResendOTP = () => {
//     setError('');
//     // Mock resend OTP
//     alert('OTP resent successfully! Use 123456 for demo.');
//   };

//   const resetForm = () => {
//     setOtp('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setError('');
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {type === 'login'
//               ? 'Verify OTP'
//               : type === 'reset'
//               ? 'Reset Password'
//               : 'Verify Your Email'}
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           {type === 'reset' && email && (
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 disabled
//                 className="bg-gray-50"
//               />
//             </div>
//           )}
          
//           <div>
//             <Label htmlFor="otp">Enter OTP</Label>
//             <Input
//               id="otp"
//               type="text"
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//               maxLength={6}
//             />
//             <p className="text-sm text-gray-500 mt-1">Use 123456 for demo</p>
//           </div>

//           {type === 'reset' && (
//             <>
//               <div>
//                 <Label htmlFor="newPassword">New Password</Label>
//                 <Input
//                   id="newPassword"
//                   type="password"
//                   placeholder="Enter new password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//               </div>
              
//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//             </>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex flex-col space-y-2">
//             <Button 
//               onClick={handleVerify} 
//               disabled={isLoading}
//               className="w-full"
//             >
//               {isLoading
//                 ? 'Verifying...'
//                 : type === 'login'
//                 ? 'Verify OTP'
//                 : type === 'reset'
//                 ? 'Reset Password'
//                 : 'Verify Email'}
//             </Button>
            
//             {(type === 'login' || type === 'verify') && (
//               <Button 
//                 variant="outline" 
//                 onClick={handleResendOTP}
//                 className="w-full"
//               >
//                 Resend OTP
//               </Button>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }




// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { validateOTP, validatePasswordMatch, validateRequired } from '@/lib/validations';

// interface OTPModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   type: 'login' | 'reset' | 'verify';
//   email?: string;
//   onSuccess: () => void;
// }

// export default function OTPModal({ isOpen, onClose, type, email, onSuccess }: OTPModalProps) {
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleVerify = async () => {
//     setError('');

//     if (!validateOTP(otp)) {
//       setError('Please enter a valid 6-digit OTP');
//       return;
//     }

//     // Reset password flow
//     if (type === 'reset') {
//       if (!validateRequired(newPassword)) {
//         setError('New password is required');
//         return;
//       }
//       if (!validatePasswordMatch(newPassword, confirmPassword)) {
//         setError('Passwords do not match');
//         return;
//       }
//     }

//     setIsLoading(true);

//     try {
//       if (type === 'verify' && email) {
//         const response = await fetch('http://localhost:3000/api/verify-otp', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, otp }),
//         });

//         const data = await response.json();

//         if (response.ok) {
//           onSuccess();
//           handleClose();
//         } else {
//           setError(data.message || 'OTP verification failed');
//         }
//       } else {
//         // Fallback mock for login/reset flows
//         setTimeout(() => {
//           if (otp === '123456' || validateOTP(otp)) {
//             onSuccess();
//             handleClose();
//           } else {
//             setError('Invalid OTP. Use 123456 for demo.');
//           }
//           setIsLoading(false);
//         }, 1000);
//         return;
//       }
//     } catch {
//       setError('Server error. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = () => {
//     alert('OTP resend is only enabled in Verify flow.');
//   };

//   const handleClose = () => {
//     setOtp('');
//     setNewPassword('');
//     setConfirmPassword('');
//     setError('');
//     onClose();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={handleClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {type === 'login' ? 'Verify OTP' : type === 'reset' ? 'Reset Password' : 'Verify Account'}
//           </DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4">
//           {type !== 'login' && email && (
//             <div>
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" value={email} disabled className="bg-gray-50" />
//             </div>
//           )}

//           <div>
//             <Label htmlFor="otp">Enter OTP</Label>
//             <Input
//               id="otp"
//               type="text"
//               placeholder="Enter 6-digit OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
//               maxLength={6}
//             />
//           </div>

//           {type === 'reset' && (
//             <>
//               <div>
//                 <Label htmlFor="newPassword">New Password</Label>
//                 <Input
//                   id="newPassword"
//                   type="password"
//                   placeholder="Enter new password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="confirmPassword">Confirm Password</Label>
//                 <Input
//                   id="confirmPassword"
//                   type="password"
//                   placeholder="Confirm new password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//               </div>
//             </>
//           )}

//           {error && (
//             <Alert variant="destructive">
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           )}

//           <div className="flex flex-col space-y-2">
//             <Button onClick={handleVerify} disabled={isLoading} className="w-full">
//               {isLoading ? 'Verifying...' : type === 'reset' ? 'Reset Password' : 'Verify OTP'}
//             </Button>

//             {type === 'login' && (
//               <Button variant="outline" onClick={handleResendOTP} className="w-full">
//                 Resend OTP
//               </Button>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }





import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateOTP, validatePasswordMatch, validateRequired } from '@/lib/validations';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'reset' | 'verify';
  email?: string;
  onSuccess: (otp?: string, newPassword?: string) => void;
}

export default function OTPModal({ isOpen, onClose, type, email, onSuccess }: OTPModalProps) {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setError('');

    if (!validateOTP(otp)) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    // Reset password flow
    if (type === 'reset') {
      if (!validateRequired(newPassword)) {
        setError('New password is required');
        return;
      }
      if (!validatePasswordMatch(newPassword, confirmPassword)) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (type === 'verify' && email) {
        const response = await fetch('http://localhost:3000/api/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();

        if (response.ok) {
          onSuccess(otp); // Pass OTP back to parent
          handleClose();
        } else {
          setError(data.message || 'OTP verification failed');
        }
      } else if (type === 'reset' && email) {
        // Call backend API to reset password
        const response = await fetch('http://localhost:3000/api/forgot-password/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp, newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
          onSuccess(otp, newPassword); // Pass OTP and new password
          handleClose();
        } else {
          setError(data.message || 'Password reset failed');
        }
      } else {
        // Fallback mock for login flow
        setTimeout(() => {
          if (otp === '123456' || validateOTP(otp)) {
            onSuccess(otp);
            handleClose();
          } else {
            setError('Invalid OTP. Use 123456 for demo.');
          }
          setIsLoading(false);
        }, 1000);
        return;
      }
    } catch {
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    alert('OTP resend is only enabled in Verify flow.');
  };

  const handleClose = () => {
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'login' ? 'Verify OTP' : type === 'reset' ? 'Reset Password' : 'Verify Account'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {type !== 'login' && email && (
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} disabled className="bg-gray-50" />
            </div>
          )}

          <div>
            <Label htmlFor="otp">Enter OTP</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
            />
          </div>

          {type === 'reset' && (
            <>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col space-y-2">
            <Button onClick={handleVerify} disabled={isLoading} className="w-full">
              {isLoading ? 'Verifying...' : type === 'reset' ? 'Reset Password' : 'Verify OTP'}
            </Button>

            {(type === 'login' || type === 'verify') && (
              <Button variant="outline" onClick={handleResendOTP} className="w-full">
                Resend OTP
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
