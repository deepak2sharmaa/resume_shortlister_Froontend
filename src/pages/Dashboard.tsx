
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, User, CheckCircle, X, Download, XCircle, Users, Eye } from 'lucide-react';
import Navbar from '@/components/Navbar';

import * as Dialog from '@radix-ui/react-dialog';

interface Candidate {
  id: number | string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  resume: string;
  skills: string[];
  experience?: string;
  TotalExperience?: string;
  WorkExperience?: {
    Company: string;
    Position: string;
    StartDate: string;
    EndDate: string;
    Description: string[];
  }[];
  Education?: {
    School: string;
    Duration: string;
    Degree: string;
    Grade?: string;
  }[];
  AwardsAndCertificates?: string[];
  isSelected: boolean;
  isRejected: boolean;
  uploadedAt?: string;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  isVerified: boolean;
  forgotPassword: boolean;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  __v: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [rejectedCandidates, setRejectedCandidates] = useState<Candidate[]>([]);
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resumeBlobUrl, setResumeBlobUrl] = useState<string | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/dashboard', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch user profile');
        const data = await response.json();
        setUserProfile(data.user);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUserProfile();

    const savedCandidates = localStorage.getItem('candidates');
    if (savedCandidates) setCandidates(JSON.parse(savedCandidates));
  }, [navigate, token]);


  useEffect(() => {
    if (activeSection === 'candidates' || activeSection === 'home') {
      fetchCandidatesFromAPI();
    }
  }, [activeSection]);


  useEffect(() => {
    const fetchSelectedCandidates = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3000/api/candidates?status=Selected', {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (res.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
        const data = await res.json();
        if (res.ok && data.candidates) {
          const mapped: Candidate[] = data.candidates.map((c: any) => ({
            id: c._id, _id: c._id, name: c.name, email: c.email, phone: c.phone,
            skills: c.skills, TotalExperience: c.totalExperience, resume: c.resume,
            isSelected: true, isRejected: c.resumeStatus === 'Rejected', uploadedAt: c.createdAt
          }));
          setSelectedCandidates(mapped);
        }
      } catch (err) { console.error(err); }
    };
    if (activeSection === 'selected') fetchSelectedCandidates();
  }, [activeSection, navigate, token]);

  useEffect(() => {
    const fetchRejectedCandidates = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:3000/api/candidates?status=Rejected', {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (res.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
        const data = await res.json();
        if (res.ok && data.candidates) {
          const mapped: Candidate[] = data.candidates.map((c: any) => ({
            id: c._id, _id: c._id, name: c.name, email: c.email, phone: c.phone,
            skills: c.skills, TotalExperience: c.totalExperience, resume: c.resume,
            isSelected: c.resumeStatus === 'Selected', isRejected: c.resumeStatus === 'Rejected',
            uploadedAt: c.createdAt
          }));
          setRejectedCandidates(mapped);
        }
      } catch (err) { console.error(err); }
    };
    if (activeSection === 'rejected') fetchRejectedCandidates();
  }, [activeSection, navigate, token]);

  const saveCandidates = (updated: Candidate[]) => {
    setCandidates(updated);
    localStorage.setItem('candidates', JSON.stringify(updated));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.type !== 'application/pdf') { setUploadError('Please upload only PDF files'); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError('File size should be less than 5MB'); return; }
    setUploadError('');

    try {
      const formData = new FormData(); formData.append('resume', file);
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) { const parsedUser = JSON.parse(currentUser); if (parsedUser?._id) formData.append('userId', parsedUser._id); }
      if (!token) return;

      const res = await fetch('http://localhost:3000/api/parse-resume', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData });
      const data = await res.json();

      if (data.message === "Candidate has already uploaded resume") { setUploadError("Candidate has already uploaded resume"); return; }
      if (data.message === "Error parsing PDF") { setUploadError("Uploaded resume is corrupted or not in proper format"); return; }
      if (!res.ok) { setUploadError(data.message || 'Failed to parse resume'); return; }

      const parsedCandidate: Candidate = {
        id: Date.now(), name: data.data.Name || '', email: data.data.Email || '',
        phone: data.data.Phone || '', skills: data.data.Skills || [], experience: data.data.TotalExperience || '',
        TotalExperience: data.data.TotalExperience || '', WorkExperience: data.data.WorkExperience || [],
        Education: data.data.Education || [], AwardsAndCertificates: data.data.AwardsAndCertificates || [],
        resume: file.name, isSelected: false, isRejected: false, uploadedAt: new Date().toISOString()
      };

      saveCandidates([...candidates, parsedCandidate]);
    } catch (err: any) { setUploadError(err.message || 'Something went wrong while uploading the resume'); }
    finally { event.target.value = ''; }
  };

  const fetchCandidatesFromAPI = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:3000/api/candidates', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) { localStorage.removeItem('token'); navigate('/login'); return; }
      if (!res.ok) throw new Error('Failed to fetch candidates');

      const data = await res.json();
      const mapped: Candidate[] = data.candidates.map((c: any) => ({
        id: c._id, _id: c._id, name: c.name, email: c.email, phone: c.phone,
        resume: c.resume, skills: c.skills, TotalExperience: c.totalExperience,
        isSelected: c.resumeStatus === 'Selected', isRejected: c.resumeStatus === 'Rejected',
        uploadedAt: c.createdAt
      }));
      setCandidates(mapped);
    } catch (err) { console.error(err); }
  };

  // ✅ Fully dynamic API handlers
  const handleSelect = async (candidate: Candidate) => {
    if (!token || !candidate._id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/candidates/${candidate._id}/select`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (res.ok) fetchCandidatesFromAPI();
    } catch (err) { console.error(err); }
  };

  const handleReject = async (candidate: Candidate) => {
    if (!token || !candidate._id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/candidates/${candidate._id}/reject`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
      if (res.ok) fetchCandidatesFromAPI();
    } catch (err) { console.error(err); }
  };

  const [deleteCandidate, setDeleteCandidate] = useState<Candidate | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleDeleteConfirmed = async () => {
    if (!token || !deleteCandidate?._id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/candidates/${deleteCandidate._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchCandidatesFromAPI();
        setSelectedCandidates(prev => prev.filter(c => c.id !== deleteCandidate.id));
        setRejectedCandidates(prev => prev.filter(c => c.id !== deleteCandidate.id));
        setIsDeleteModalOpen(false);
        setDeleteCandidate(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResume = async (candidate: Candidate) => {
    if (!token || !candidate._id) return;

    try {
      const res = await fetch(`http://localhost:3000/api/resume/${candidate._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch resume');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setResumeBlobUrl(url);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert('Could not load resume. Please try again.');
    }
  };

  const handleDownloadResume = async (candidate: Candidate) => {
    if (!token || !candidate._id) return;
    try {
      const res = await fetch(`http://localhost:3000/api/resume/${candidate._id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to download');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = candidate.resume; link.click();
      URL.revokeObjectURL(url);
    } catch (err) { console.error(err); }
  };

  const removeCandidate = (id: string | number) => {
    const updated = candidates.filter(c => c.id !== id);
    saveCandidates(updated);
  };

  const toggleCandidateSelection = (id: string | number) => {
    const updated = candidates.map(c =>
      c.id === id ? { ...c, isSelected: !c.isSelected, isRejected: c.isSelected ? c.isRejected : false } : c
    );
    saveCandidates(updated);
  };

  const toggleCandidateRejection = (id: string | number) => {
    const updated = candidates.map(c =>
      c.id === id ? { ...c, isRejected: !c.isRejected, isSelected: c.isRejected ? c.isSelected : false } : c
    );
    saveCandidates(updated);
  };

  const renderHomeSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected Candidates</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.filter(c => c.isSelected).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resumes Uploaded</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{candidates.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selection Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {candidates.length > 0 ? Math.round((candidates.filter(c => c.isSelected).length / candidates.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome to BesResumes Shortlister</CardTitle>
          <CardDescription>
            Streamline your recruitment process with our intelligent resume management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveSection('uploader')}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveSection('candidates')}
                >
                  <User className="mr-2 h-4 w-4" />
                  View Candidates
                </Button>
                     <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveSection('selected')}
                >
             <CheckCircle className="mr-2 h-4 w-4" />
                  
                  Selected Candidates
                </Button>


    <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveSection('rejected')}
                >
             <XCircle className="mr-2 h-4 w-4" />
              
                  
                  Rejected Candidates
                </Button>
                
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="text-sm text-gray-600">
                {candidates.length > 0 ? (
                  <p>Last resume uploaded: {new Date(candidates[candidates.length - 1].uploadedAt).toLocaleDateString()}</p>
                ) : (
                  <p>No resumes uploaded yet</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCandidatesSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>All Candidates</CardTitle>
            <CardDescription>Manage and review candidate profiles</CardDescription>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a resume.</p>
                <div className="mt-6">
                  <Button onClick={() => setActiveSection('uploader')}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Resume
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className={`relative ${candidate.isSelected ? 'ring-2 ring-green-500' : ''} ${candidate.isRejected ? 'ring-2 ring-red-500' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{candidate.name}</CardTitle>
                          <CardDescription>{candidate.email}</CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteCandidate(candidate);
                            setIsDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>

                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {candidate.phone && <p className="text-sm text-gray-600">Phone: {candidate.phone}</p>}
                      <p className="text-sm text-gray-600">Total Experience: {candidate.TotalExperience}</p>
                      <div>
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill: string, index: number) => {
                            const cleanedSkill = skill.replace(/^•|^|\s+/g, '').trim();
                            const splitSkills = cleanedSkill.includes(',') ? cleanedSkill.split(',').map(s => s.trim()) : [cleanedSkill];
                            return splitSkills.map((s, i) => <Badge key={`${index}-${i}`} variant="secondary" className="text-xs break-words max-w-full">{s}</Badge>);
                          })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 space-x-2">
                        <div className="flex items-center space-x-1">
                          <Button variant={candidate.isSelected ? 'default' : 'outline'} size="sm" onClick={() => handleSelect(candidate)}>
                            {candidate.isSelected ? <><CheckCircle className="mr-2 h-4 w-4" /> Selected</> : 'Select'}
                          </Button>
                          <Button variant={candidate.isRejected ? "destructive" : "outline"} size="sm" onClick={() => handleReject(candidate)}>
                            {candidate.isRejected ? <><XCircle className="mr-2 h-4 w-4 text-white bg-red-600 rounded-full p-0.5" /> Rejected</> : "Reject"}
                          </Button>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="p-1" onClick={() => handleViewResume(candidate)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1" onClick={() => handleDownloadResume(candidate)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>


        <Dialog.Root
          open={isModalOpen}
          onOpenChange={() => {
            setIsModalOpen(false);
            setResumeBlobUrl(null);
          }}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-auto">
              <Dialog.Title className="text-lg font-bold mb-4">Resume Preview</Dialog.Title>
              <Dialog.Description className="text-sm mb-4">
                View the candidate's resume below
              </Dialog.Description>

              {resumeBlobUrl ? (
                <iframe
                  src={`${resumeBlobUrl}#toolbar=0`} // Hide left-side toolbar / page preview
                  className="w-full h-[600px]"
                />
              ) : (
                <p>Loading resume...</p>
              )}

              <div className="mt-4 flex justify-end space-x-2">

                <Button
                  variant="outline"
                  onClick={() => {
                    if (resumeBlobUrl) {
                      const printWindow = window.open(resumeBlobUrl, '_blank');
                      if (printWindow) printWindow.print();
                    }
                  }}
                >
                  Print
                </Button>


                <Button
                  variant="outline"
                  onClick={() => {
                    if (resumeBlobUrl) {
                      const link = document.createElement('a');
                      link.href = resumeBlobUrl;
                      link.download = 'resume.pdf';
                      link.click();
                      URL.revokeObjectURL(resumeBlobUrl);
                    }
                  }}
                >
                  Download
                </Button>

                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setResumeBlobUrl(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>


        <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <Dialog.Title className="text-lg font-bold mb-4">Delete Resume</Dialog.Title>
              <Dialog.Description className="text-sm mb-4">
                Are you sure you want to delete this resume of <strong>{deleteCandidate?.name}</strong>?
              </Dialog.Description>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteConfirmed}>Delete</Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>

      </div>
    );
  };



  const renderUploaderSection = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Uploader</CardTitle>
          <CardDescription>Upload PDF resumes to add candidates to your database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="resume-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Click to upload or drag and drop
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  PDF files only, max 5MB
                </span>
              </label>
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
          {uploadError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {candidates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {candidates.slice(-5).reverse().map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{candidate.name}</p>
                      <p className="text-sm text-gray-500">{candidate.resume}</p>
                      {candidate.phone && <p className="text-sm text-gray-500">Phone: {candidate.phone}</p>}
                      {candidate.experience && <p className="text-sm text-gray-500">Experience: {candidate.experience}</p>}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(candidate.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );


  const renderSelectedSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Selected Candidates</CardTitle>
            <CardDescription>
              Candidates you've shortlisted for further review ({selectedCandidates.length} selected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedCandidates.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates selected</h3>
                <p className="mt-1 text-sm text-gray-500">Select candidates from the candidate list to see them here.</p>
                <div className="mt-6">
                  <Button onClick={() => setActiveSection('candidates')}>
                    <User className="mr-2 h-4 w-4" />
                    View All Candidates
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedCandidates.map((candidate) => (
                  <Card key={candidate.id} className="border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <h3 className="font-medium">{candidate.name}</h3>
                              <p className="text-sm text-gray-500">Email: {candidate.email}</p>
                              <p className="text-sm text-gray-600">Phone: {candidate.phone}</p>
                              <p className="text-sm text-gray-600">Experience: {candidate.TotalExperience}</p>
                            </div>
                          </div>
                          <div className="mt-2 ml-8">
                            <p className="text-sm font-medium mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.map((skill: string, index: number) => {
                                const cleanedSkill = skill.replace(/^•|^|\s+/g, '').trim();
                                const splitSkills = cleanedSkill.includes(',')
                                  ? cleanedSkill.split(',').map(s => s.trim())
                                  : [cleanedSkill];
                                return splitSkills.map((s, i) => (
                                  <Badge key={`${index}-${i}`} variant="secondary" className="text-xs break-words max-w-full">
                                    {s}
                                  </Badge>
                                ));
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="p-1" onClick={() => handleViewResume(candidate)}>
                            <Eye className="h-4 w-4" />
                          </Button>


                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteCandidate(candidate);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog.Root
          open={isModalOpen}
          onOpenChange={() => {
            setIsModalOpen(false);
            setResumeBlobUrl(null);
          }}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-auto">
              <Dialog.Title className="text-lg font-bold mb-4">Resume Preview</Dialog.Title>
              <Dialog.Description className="text-sm mb-4">
                View the candidate's resume below
              </Dialog.Description>

              {resumeBlobUrl ? (
                <iframe
                  src={`${resumeBlobUrl}#toolbar=0`} // Hide left-side toolbar / page preview
                  className="w-full h-[600px]"
                />
              ) : (
                <p>Loading resume...</p>
              )}

              <div className="mt-4 flex justify-end space-x-2">

                <Button
                  variant="outline"
                  onClick={() => {
                    if (resumeBlobUrl) {
                      const printWindow = window.open(resumeBlobUrl, '_blank');
                      if (printWindow) printWindow.print();
                    }
                  }}
                >
                  Print
                </Button>


                <Button
                  variant="outline"
                  onClick={() => {
                    if (resumeBlobUrl) {
                      const link = document.createElement('a');
                      link.href = resumeBlobUrl;
                      link.download = 'resume.pdf';
                      link.click();
                      URL.revokeObjectURL(resumeBlobUrl);
                    }
                  }}
                >
                  Download
                </Button>

                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setResumeBlobUrl(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>


        <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <Dialog.Title className="text-lg font-bold mb-4">Delete Resume</Dialog.Title>
              <Dialog.Description className="text-sm mb-4">
                Are you sure you want to delete this resume of <strong>{deleteCandidate?.name}</strong>?
              </Dialog.Description>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteConfirmed}>Delete</Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>

      </div>
    );
  };




  const renderRejectedSection = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Rejected Candidates</CardTitle>
            <CardDescription>
              Candidates you’ve marked as not suitable ({rejectedCandidates.length} rejected)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {rejectedCandidates.length === 0 ? (
              <div className="text-center py-8">
                <XCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates rejected</h3>
                <p className="mt-1 text-sm text-gray-500">Reject candidates from the candidate list to see them here.</p>
                <div className="mt-6">
                  <Button onClick={() => setActiveSection('candidates')}>
                    <Users className="mr-2 h-4 w-4" />
                    View All Candidates
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {rejectedCandidates.map((candidate) => (
                  <Card key={candidate.id} className="border-red-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <XCircle className="h-5 w-5 text-red-500" />
                            <div>
                              <h3 className="font-medium">{candidate.name}</h3>
                              <p className="text-sm text-gray-500">Email: {candidate.email}</p>
                              {candidate.phone && <p className="text-sm text-gray-600">Phone: {candidate.phone}</p>}
                              <p className="text-sm text-gray-600">
                                Experience: {candidate.experience || candidate.TotalExperience}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 ml-8">
                            <p className="text-sm font-medium mb-2">Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.length > 0 &&
                                candidate.skills.map((skill: string, index: number) => {
                                  const cleanedSkill = skill.replace(/^•|^|\s+/g, '').trim();
                                  const splitSkills = cleanedSkill.includes(',')
                                    ? cleanedSkill.split(',').map(s => s.trim())
                                    : [cleanedSkill];
                                  return splitSkills.map((s, i) => (
                                    <Badge key={`${index}-${i}`} variant="secondary" className="text-xs break-words max-w-full">
                                      {s}
                                    </Badge>
                                  ));
                                })}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
         <Button variant="ghost" size="sm" className="p-1" onClick={() => handleViewResume(candidate)}>
                            <Eye className="h-4 w-4" />
                          </Button>


                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setDeleteCandidate(candidate);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </Button>




   

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>




        <Dialog.Root
          open={isModalOpen}
          onOpenChange={() => {
            setIsModalOpen(false);
            setResumeBlobUrl(null);
          }}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 overflow-auto">
              <Dialog.Title className="text-lg font-bold mb-4">Resume Preview</Dialog.Title>
              <Dialog.Description className="text-sm mb-4">
                View the candidate's resume below
              </Dialog.Description>

              {resumeBlobUrl ? (
                <iframe
                  src={`${resumeBlobUrl}#toolbar=0`} // Hide left-side toolbar / page preview
                  className="w-full h-[600px]"
                />
              ) : (
                <p>Loading resume...</p>
              )}

              <div className="mt-4 flex justify-end space-x-2">

                <Button
                  variant="outline"
                  onClick={() => {
                    if (resumeBlobUrl) {
                      const printWindow = window.open(resumeBlobUrl, '_blank');
                      if (printWindow) printWindow.print();
                    }
                  }}
                >
                  Print
                </Button>


                <Button
                  variant="outline"
                  onClick={() => {
                    if (resumeBlobUrl) {
                      const link = document.createElement('a');
                      link.href = resumeBlobUrl;
                      link.download = 'resume.pdf';
                      link.click();
                      URL.revokeObjectURL(resumeBlobUrl);
                    }
                  }}
                >
                  Download
                </Button>

                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setResumeBlobUrl(null);
                  }}
                >
                  Close
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>








        <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <Dialog.Title className="text-lg font-bold mb-4">Delete Resume</Dialog.Title>
              <Dialog.Description className="text-sm mb-4">
                Are you sure you want to delete this resume of <strong>{deleteCandidate?.name}</strong>?
              </Dialog.Description>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleDeleteConfirmed}>Delete</Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>


      </div>
    );
  };




  const renderContent = () => {
    switch (activeSection) {
      case 'home':
        return renderHomeSection();
      case 'candidates':
        return renderCandidatesSection();
      case 'uploader':
        return renderUploaderSection();
      case 'selected':
        return renderSelectedSection();
      case 'rejected':
        return renderRejectedSection();
      default:
        return renderHomeSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}
