export type UserRole = "cliente" | "admin";
export type WorkType = "formal" | "informal" | "negocio_proprio";
export type ApplicationStatus =
  | "em_analise"
  | "pendente_info"
  | "aprovado"
  | "rejeitado"
  | "pago"
  | "finalizado";
export type DocumentType = "bi_frente" | "bi_verso" | "comprovativo_residencia";
export type ResidenceProof = "declaracao_bairro" | "talao_energia" | "talao_agua" | "outro";

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface CreditApplication {
  id: string;
  client_id: string;
  full_name: string;
  birth_date: string;
  document_number: string;
  phone: string;
  neighborhood: string;
  city: string;
  full_address: string;
  occupation: string;
  workplace_name: string | null;
  work_type: WorkType;
  monthly_income: number;
  amount_requested: number;
  loan_reason: string;
  desired_term: string;
  status: ApplicationStatus;
  admin_notes: string | null;
  approved_amount: number | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  application_id: string;
  client_id: string;
  doc_type: DocumentType;
  residence_proof_type: ResidenceProof | null;
  file_path: string;
  uploaded_at: string;
}

export interface StatusHistory {
  id: string;
  application_id: string;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface NotificationRecord {
  id: string;
  client_id: string;
  application_id: string | null;
  channel: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: never; Update: Partial<Profile> };
      credit_applications: {
        Row: CreditApplication;
        Insert: Omit<
          CreditApplication,
          "id" | "status" | "admin_notes" | "approved_amount" | "reviewed_by" | "reviewed_at" | "created_at"
        >;
        Update: Partial<CreditApplication>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, "id" | "uploaded_at">;
        Update: Partial<Document>;
      };
      status_history: {
        Row: StatusHistory;
        Insert: Omit<StatusHistory, "id" | "created_at">;
        Update: never;
      };
      notifications: {
        Row: NotificationRecord;
        Insert: Omit<NotificationRecord, "id" | "created_at">;
        Update: never;
      };
    };
  };
}
