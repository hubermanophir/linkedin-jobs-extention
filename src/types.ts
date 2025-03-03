export interface JobsWithDetails {
  jobId: string;
  description?: string;
  url?: string;
  company?: string;
}

export interface LinkedinJobElement extends Element {
  dataset?: {
    occludableJobId?: string;
  };
}
