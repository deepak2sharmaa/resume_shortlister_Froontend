import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, User, CheckCircle, X, Download } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string;
  resume: string;
  skills: string[];
  experience: string;
  isSelected: boolean;
  uploadedAt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Load candidates from localStorage
    const savedCandidates = localStorage.getItem('candidates');
    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    }
  }, [navigate]);

  const saveCandidates = (updatedCandidates: Candidate[]) => {
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Please upload only PDF files');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('File size should be less than 5MB');
      return;
    }

    setUploadError('');

    // Mock candidate data extraction from PDF
    const mockCandidate: Candidate = {
      id: Date.now(),
      name: `Candidate ${candidates.length + 1}`,
      email: `candidate${candidates.length + 1}@example.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      resume: file.name,
      skills: ['JavaScript', 'React', 'Node.js', 'Python'].slice(0, Math.floor(Math.random() * 4) + 1),
      experience: `${Math.floor(Math.random() * 8) + 1} years`,
      isSelected: false,
      uploadedAt: new Date().toISOString()
    };

    const updatedCandidates = [...candidates, mockCandidate];
    saveCandidates(updatedCandidates);

    // Reset file input
    event.target.value = '';
  };

  const toggleCandidateSelection = (id: number) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === id ? { ...candidate, isSelected: !candidate.isSelected } : candidate
    );
    saveCandidates(updatedCandidates);
  };

  const removeCandidate = (id: number) => {
    const updatedCandidates = candidates.filter(candidate => candidate.id !== id);
    saveCandidates(updatedCandidates);
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

  const renderCandidatesSection = () => (
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
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className={`relative ${candidate.isSelected ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{candidate.name}</CardTitle>
                        <CardDescription>{candidate.email}</CardDescription>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCandidate(candidate.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Phone: {candidate.phone}</p>
                      <p className="text-sm text-gray-600">Experience: {candidate.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Button
                        variant={candidate.isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleCandidateSelection(candidate.id)}
                      >
                        {candidate.isSelected ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          'Select'
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

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
    const selectedCandidates = candidates.filter(c => c.isSelected);
    
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
                              <p className="text-sm text-gray-500">{candidate.email} • {candidate.phone}</p>
                            </div>
                          </div>
                          <div className="mt-2 ml-8">
                            <p className="text-sm text-gray-600">Experience: {candidate.experience}</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {candidate.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCandidateSelection(candidate.id)}
                            className="text-red-600 hover:text-red-700"
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