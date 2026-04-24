/** Mic listing item — shape returned by GET /api/mics after serialization */
export interface MicListItem {
  id: number;
  borough: string | null;
  confirmed: string | null;
  day: string | null;
  name: string | null;
  start_time: string | null;
  end_time: string | null;
  instagram: string | null;
  website: string | null;
  email_address: string | null;
  venue_type: string | null;
  stage_time: string | null;
  other_rules: string | null;
  neighborhood?: string | null;
  mic_address: {
    venue: string | null;
    street_name: string | null;
    unit_number: number;
    latitude: string | null;
    longitude: string | null;
  } | null;
  mic_cost: {
    cost_amount: string | null;
  } | null;
  mic_occurrence: {
    schedule: string | null;
  } | null;
}

/** Mic detail — shape returned by GET /mics/[id] server component after serialization */
export interface MicDetail extends MicListItem {
  phone_number: string | null;
  notes: string | null;
  signup_instructions: {
    instructions: string | null;
  } | null;
  host_mics: {
    mic_host: {
      first_host: string | null;
      email: string | null;
      instagram: string | null;
    };
  }[];
}

/** Paginated mic listing response from /api/mics */
export interface MicListResponse {
  totalMics: number;
  offset: number;
  limit: number;
  mics: MicListItem[];
}
