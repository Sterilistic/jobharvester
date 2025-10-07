export interface Job {
  id: number;
  name: string;
  requisition_id: string | null;
  notes: string | null;
  confidential: boolean;
  is_template: boolean | null;
  copied_from_id: number | null;
  status: string;
  created_at: string;
  opened_at: string;
  closed_at: string | null;
  updated_at: string;
  departments: Array<{
    id: number;
    name: string;
  } | null>;
  offices: Array<{
    id: number;
    name: string;
  }>;
  hiring_team: {
    hiring_managers: Array<{
      id: number;
      first_name: string;
      last_name: string;
      name: string;
      employee_id: string;
    }>;
    recruiters: Array<{
      id: number;
      first_name: string;
      last_name: string;
      name: string;
      employee_id: string;
    }>;
    coordinators: Array<{
      id: number;
      first_name: string;
      last_name: string;
      name: string;
      employee_id: string;
    }>;
    sourcers: Array<{
      id: number;
      first_name: string;
      last_name: string;
      name: string;
      employee_id: string;
    }>;
  };
  openings: Array<{
    id: number;
    opening_id: string;
    status: string;
    opened_at: string;
    closed_at: string | null;
    application_id: number | null;
    close_reason: string | null;
  }>;
  custom_fields: {
    employment_type: string | null;
    reason_for_hire: string | null;
  };
  keyed_custom_fields: {
    employment_type: string | null;
    reason_for_hire: string | null;
  };
}

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  company: string;
  title: string;
  created_at: string;
  updated_at: string;
  last_activity: string;
  is_private: boolean;
  photo_url: string;
  attachments: Array<{
    filename: string;
    url: string;
    type: string;
  }>;
  application_ids: number[];
  phone_numbers: Array<{
    value: string;
    type: string;
  }>;
  addresses: Array<{
    value: string;
    type: string;
  }>;
  email_addresses: Array<{
    value: string;
    type: string;
  }>;
  website_addresses: Array<{
    value: string;
    type: string;
  }>;
  social_media_addresses: Array<{
    value: string;
    type: string;
  }>;
  recruiter: {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    employee_id: string;
  };
  coordinator: {
    id: number;
    first_name: string;
    last_name: string;
    name: string;
    employee_id: string;
  };
  can_email: boolean;
  tags: string[];
  applications: Array<{
    id: number;
    candidate_id: number;
    prospect: boolean;
    applied_at: string;
    rejected_at: string;
    last_activity_at: string;
    location: {
      address: string;
    };
    source: {
      id: number;
      public_name: string;
    };
    credited_to: {
      id: number;
      first_name: string;
      last_name: string;
      name: string;
      employee_id: string;
    };
    rejection_reason: {
      id: number;
      name: string;
      type: string;
    };
    rejection_details: string;
    jobs: Array<{
      id: number;
      name: string;
    }>;
    job_post_id: number;
    status: string;
    current_stage: {
      id: number;
      name: string;
    };
    answers: Array<{
      question: string;
      answer: string;
    }>;
    prospect_detail: {
      prospect_pool: {
        id: number;
        name: string;
      };
      prospect_stage: {
        id: number;
        name: string;
      };
      prospect_owner: {
        id: number;
        name: string;
      };
    };
    custom_fields: Array<{
      name: string;
      type: string;
      value: string;
    }>;
    keyed_custom_fields: Record<string, string>;
  }>;
}

export interface ApiResponse<T> {
  jobs?: T[];
  candidates?: T[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    has_next_page?: boolean;
    has_prev_page?: boolean;
  };
}
