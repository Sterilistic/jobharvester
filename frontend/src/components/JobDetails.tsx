import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Job, Candidate, ApiResponse } from '../types/greenhouse';
import Pagination from './Pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building, FileText, Linkedin, Mail } from 'lucide-react';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [candidatesPage, setCandidatesPage] = useState(1);
  const [candidatesMeta, setCandidatesMeta] = useState<ApiResponse<Candidate>['meta'] | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const jobId = parseInt(id);
        
        // Fetch job details and candidates in parallel
        const [jobData, candidatesData] = await Promise.all([
          apiService.getJobById(jobId),
          apiService.getCandidatesForJob(jobId, candidatesPage, 10)
        ]);
        
        setJob(jobData);
        setCandidates(candidatesData.candidates || []);
        setCandidatesMeta(candidatesData.meta || null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, candidatesPage]);

  const handleCandidatesPageChange = (page: number) => {
    setCandidatesPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold">Loading job details...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/jobs')} variant="outline">
              Back to Jobs List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Job not found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/jobs')} variant="outline">
              Back to Jobs List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/jobs')}
          className="mb-4"
        >
          ← Back to Jobs List
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-2xl">{job.name}</CardTitle>
                <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Status</h4>
                  <p>{job.status}</p>
                </div>
                {job.departments.filter(dept => dept !== null).length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Department</h4>
                    <p>{job.departments.filter(dept => dept !== null).map(dept => dept!.name).join(', ')}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Created</h4>
                  <p>{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-1">Opened</h4>
                  <p>{new Date(job.opened_at).toLocaleDateString()}</p>
                </div>
                {job.requisition_id && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Requisition ID</h4>
                    <p className="font-mono text-sm">{job.requisition_id}</p>
                  </div>
                )}
                {job.openings.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Openings</h4>
                    <p>{job.openings.length} position(s)</p>
                  </div>
                )}
              </div>

              {job.notes && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Notes</h4>
                  <p className="text-muted-foreground">{job.notes}</p>
                </div>
              )}

              {job.hiring_team.hiring_managers.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Hiring Team</h4>
                  <p className="text-muted-foreground">
                    <strong>Hiring Managers:</strong> {job.hiring_team.hiring_managers.map(hm => hm.name).join(', ')}
                  </p>
                </div>
              )}

              {job.custom_fields.employment_type && (
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Job Details</h4>
                  <div className="space-y-2">
                    <p><strong>Employment Type:</strong> {job.custom_fields.employment_type}</p>
                    {job.custom_fields.reason_for_hire && (
                      <p><strong>Reason for Hire:</strong> {job.custom_fields.reason_for_hire}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Candidates ({candidates.length})</CardTitle>
              <CardDescription>
                {candidates.length === 0 ? 'No candidates have applied yet' : 'View candidate applications'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {candidates.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No candidates have applied for this job yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <Card key={candidate.id} className="p-4">
                      <div className="space-y-2">
                        <div className="font-semibold">
                          {candidate.first_name} {candidate.last_name}
                        </div>
                        
                        {candidate.email_addresses.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-2"><Mail /> {candidate.email_addresses[0].value}</span>
                          </div>
                        )}
                        
                        {candidate.website_addresses.length > 0 && (
                          <div className="text-sm">
                            <a 
                              href={candidate.website_addresses[0].value} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <span className="flex items-center gap-2"><Linkedin /> {candidate.website_addresses[0].value}</span>
                            </a>
                          </div>
                        )}
                        
                        {candidate.company && (
                          <div className="text-sm text-muted-foreground">
                            <span className="flex items-center gap-2"><Building /> {candidate.company}</span>
                            {candidate.title && ` - ${candidate.title}`}
                          </div>
                        )}
                        
                        {candidate.attachments.length > 0 && (
                          <div className="text-sm">
                            <a 
                              href={candidate.attachments[0].url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <span className="flex items-center gap-2"><FileText /> Resume</span>
                            </a>
                          </div>
                        )}
                        
                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          Applied: {new Date(candidate.created_at).toLocaleDateString()}
                          {candidate.applications.length > 0 && (
                            <span> | Status: {candidate.applications[0].status}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {candidatesMeta && candidates.length > 0 && (
                <Pagination
                  variant="vertical"
                  currentPage={candidatesPage}
                  hasNextPage={candidatesMeta.has_next_page || false}
                  hasPrevPage={candidatesMeta.has_prev_page || false}
                  onPageChange={handleCandidatesPageChange}
                  totalItems={candidatesMeta.total}
                  itemsPerPage={candidatesMeta.per_page}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
