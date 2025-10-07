import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { Job, ApiResponse } from '../types/greenhouse';
import Pagination from './Pagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<ApiResponse<Job>['meta'] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await apiService.getJobs(currentPage, 10);
        setJobs(response.jobs || []);
        setPaginationMeta(response.meta || null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleJobClick = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold">Loading jobs...</h3>
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
            <Button onClick={() => navigate('/')} variant="outline">
              Back to API Key Form
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Available Jobs</CardTitle>
          <CardDescription>
            Click on a job to view details and candidates
          </CardDescription>
        </CardHeader>
      </Card>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground">There are no jobs available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <Card 
              key={job.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-primary/50"
              onClick={() => handleJobClick(job.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{job.name}</CardTitle>
                  <Badge variant={job.status === 'open' ? 'default' : 'secondary'}>
                    {job.status}
                  </Badge>
                </div>
                {job.departments.filter(dept => dept !== null).length > 0 && (
                  <CardDescription>
                    {job.departments.filter(dept => dept !== null).map(dept => dept!.name).join(', ')}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div>Created: {new Date(job.created_at).toLocaleDateString()}</div>
                  {job.requisition_id && (
                    <div>Requisition ID: {job.requisition_id}</div>
                  )}
                  {job.openings.length > 0 && (
                    <div>{job.openings.length} opening(s)</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {paginationMeta && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            hasNextPage={paginationMeta.has_next_page || false}
            hasPrevPage={paginationMeta.has_prev_page || false}
            onPageChange={handlePageChange}
            totalItems={paginationMeta.total}
            itemsPerPage={paginationMeta.per_page}
          />
        </div>
      )}
    </div>
  );
};

export default JobsList;
