export interface PoliceStation {
  id: string;
  name: string;
  name_ml: string;
  address: string;
  district: string;
  phone: string;
  email: string;
  created_at: string;
}

export interface Officer {
  id: string;
  name: string;
  rank: string;
  badge_number: string;
  station_id: string;
  phone: string;
  created_at: string;
  police_stations?: PoliceStation;
}

export interface CrimeType {
  id: string;
  name: string;
  name_ml: string;
  ipc_section: string;
  description: string;
}

export interface FIR {
  id: string;
  fir_number: string;
  date_filed: string;
  time_filed: string;
  station_id: string;
  crime_type_id: string;
  investigating_officer_id: string;
  location: string;
  location_ml: string;
  description: string;
  complainant_name: string;
  status: 'Registered' | 'Under Investigation' | 'Charge Sheet Filed' | 'Court Proceedings' | 'Closed';
  created_at: string;
  updated_at: string;
  police_stations?: PoliceStation;
  crime_types?: CrimeType;
  officers?: Officer;
}

export interface CaseFollowup {
  id: string;
  fir_id: string;
  date: string;
  title: string;
  description: string;
  officer_id: string;
  created_at: string;
  officers?: Officer;
}

export interface NewsArticle {
  id: string;
  fir_id: string;
  title: string;
  source: string;
  publication_date: string;
  url: string;
  is_verified: boolean;
  created_at: string;
}

export interface FIRWithRelations extends FIR {
  police_stations: PoliceStation;
  crime_types: CrimeType;
  officers: Officer;
  case_followups?: CaseFollowup[];
  news_articles?: NewsArticle[];
  person_involvements?: PersonInvolvement[];
}

export enum InvolvementType {
  ACCUSED = "Accused",
  VICTIM = "Victim",
  WITNESS = "Witness",
  COMPLAINANT = "Complainant",
  SUSPECT = "Suspect"
}

export interface Person {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  address: string;
  phone: string;
  photo_url?: string;
  aadhar_number?: string;
  created_at: string;
}

export interface PersonInvolvement {
  id: string;
  person_id: string;
  fir_id: string;
  involvement_type: InvolvementType;
  details?: string;
  created_at: string;
  person?: Person;
  fir?: FIR;
}

export interface CaseNote {
  id: string;
  fir_id: string;
  officer_id: string;
  note: string;
  created_at: string;
  updated_at: string;
  officers?: Officer;
}

export interface Evidence {
  id: string;
  fir_id: string;
  officer_id: string;
  url: string;
  type: string;
  description?: string;
  created_at: string;
  officers?: Officer;
}

export interface Notification {
  id: string;
  officer_id: string;
  fir_id?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id?: string;
  action: string;
  performed_by?: string;
  change_details?: any;
  created_at: string;
}

export interface DashboardStats {
  totalFirs: number;
  underInvestigation: number;
  chargeSheetFiled: number;
  closedCases: number;
}


