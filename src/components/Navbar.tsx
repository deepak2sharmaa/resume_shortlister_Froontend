

// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { 
//   DropdownMenu, 
//   DropdownMenuContent, 
//   DropdownMenuItem, 
//   DropdownMenuTrigger 
// } from '@/components/ui/dropdown-menu';
// import { Menu, X, Home, Users, Upload, CheckCircle, LogOut, XCircle, } from 'lucide-react';

// interface NavbarProps {
//   activeSection: string;
//   onSectionChange: (section: string) => void;
// }

// interface UserProfile {
//   name: string;
//   username: string;
//   email: string;
//   mobile: string;
//   firstName: string;
//   lastName: string;
// }

// export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const fetchProfile = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/api/dashboard', {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         const data = await response.json();
//         if (response.ok) {
//           setProfile({
//             name: data.user.name,
//             username: data.user.username,
//             email: data.user.email,
//             mobile: data.user.mobile,
//             firstName: data.user.firstName,
//             lastName: data.user.lastName,
//           });
//           localStorage.setItem('currentUser', JSON.stringify(data.user));
//         } else {
//           navigate('/login');
//         }
//       } catch {
//         navigate('/login');
//       }
//     };

//     fetchProfile();
//   }, [navigate]);

//   const userInitials = profile 
//     ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
//     : 'U';

//   const menuItems = [
//     { id: 'home', label: 'Home', icon: Home },
//     { id: 'candidates', label: 'Candidate Names', icon: Users },
//     { id: 'uploader', label: 'Resume Uploader', icon: Upload },
//     { id: 'selected', label: 'Selected Candidates', icon: CheckCircle },
//     { id: 'rejected', label: 'Rejected Candidates', icon: XCircle },
//   ];



//   const handleLogout = async () => {
//   const token = localStorage.getItem('token');
//   try {
//     if (token) {
//       await fetch('http://localhost:3000/api/logout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     }
//   } catch (error) {
//     console.error('Logout API failed', error);
//   } finally {
//     // Always clear localStorage and navigate to login
//     localStorage.removeItem('token');
//     localStorage.removeItem('currentUser');
//     navigate('/login');
//   }
// };


//   return (
//     <nav className="bg-white shadow-lg border-b">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <h1 className="text-xl font-bold text-blue-600">BesResumes Shortlister</h1>
//           </div>

//           {/* Desktop Menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Button
//                   key={item.id}
//                   variant={activeSection === item.id ? 'default' : 'ghost'}
//                   onClick={() => onSectionChange(item.id)}
//                   className="flex items-center space-x-2"
//                 >
//                   <Icon className="h-4 w-4" />
//                   <span>{item.label}</span>
//                 </Button>
//               );
//             })}
//           </div>

//           {/* Profile Section */}
//           <div className="flex items-center space-x-4">
//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//               </Button>
//             </div>

//             {/* User Profile */}
//             {profile && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="flex items-center space-x-2 p-2">
//                     <Avatar className="h-8 w-8">
//                       <AvatarFallback className="bg-blue-500 text-white text-sm">
//                         {userInitials}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="hidden sm:block text-left">
//                       <p className="text-sm font-medium">{profile.firstName} {profile.lastName}</p>
//                       <p className="text-xs text-gray-500">{profile.email}</p>
//                     </div>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-60">
//                   <div className="px-3 py-2 border-b space-y-1">
//                     <div className="flex justify-between">
//                       <p className="text-sm font-medium">Name:</p>
//                       <p className="text-sm">{profile.name}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="text-sm font-medium">Username:</p>
//                       <p className="text-sm">{profile.username}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="text-sm font-medium">Email:</p>
//                       <p className="text-sm">{profile.email}</p>
//                     </div>
//                     <div className="flex justify-between">
//                       <p className="text-sm font-medium">Mobile:</p>
//                       <p className="text-sm">{profile.mobile}</p>
//                     </div>
//                   </div>
//                   <DropdownMenuItem onClick={handleLogout} className="text-red-600">
//                     <LogOut className="mr-2 h-4 w-4" />
//                     Logout
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t bg-white">
//             <div className="px-2 pt-2 pb-3 space-y-1">
//               {menuItems.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Button
//                     key={item.id}
//                     variant={activeSection === item.id ? 'default' : 'ghost'}
//                     onClick={() => {
//                       onSectionChange(item.id);
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="w-full justify-start flex items-center space-x-2"
//                   >
//                     <Icon className="h-4 w-4" />
//                     <span>{item.label}</span>
//                   </Button>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }




import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Menu, X, Home, Users, Upload, CheckCircle, LogOut, XCircle } from 'lucide-react';

interface NavbarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

interface UserProfile {
  name: string;
  username: string;
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

export default function Navbar({ activeSection, onSectionChange }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setProfile({
            name: data.user.name,
            username: data.user.username,
            email: data.user.email,
            mobile: data.user.mobile,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
          });
          localStorage.setItem('currentUser', JSON.stringify(data.user));
        } else {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  const userInitials = profile 
    ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'candidates', label: 'Candidate Names', icon: Users },
    { id: 'uploader', label: 'Resume Uploader', icon: Upload },
    { id: 'selected', label: 'Selected Candidates', icon: CheckCircle },
    { id: 'rejected', label: 'Rejected Candidates', icon: XCircle },
  ];

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        await fetch('http://localhost:3000/api/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">BesResumes Shortlister</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? 'default' : 'ghost'}
                   
                  onClick={() => onSectionChange?.(item.id)} /* ✅ safe optional call */
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

            {/* User Profile */}
            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium">{profile.firstName} {profile.lastName}</p>
                      <p className="text-xs text-gray-500">{profile.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <div className="px-3 py-2 border-b space-y-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Name:</p>
                      <p className="text-sm">{profile.name}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Username:</p>
                      <p className="text-sm">{profile.username}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Email:</p>
                      <p className="text-sm">{profile.email}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm font-medium">Mobile:</p>
                      <p className="text-sm">{profile.mobile}</p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? 'default' : 'ghost'}
                    onClick={() => {
                      onSectionChange?.(item.id); {/* ✅ safe optional call */}
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
