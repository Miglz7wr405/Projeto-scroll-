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

// Nota: estes tipos de linha usam `type` (não `interface`) propositadamente —
// o algoritmo de inferência de `.select()` do postgrest-js só resolve a
// coluna corretamente quando a Row é um tipo objeto simples.
export type Profile = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  role: UserRole;
  created_at: string;
};

export type CreditApplication = {
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
};

export type Document = {
  id: string;
  application_id: string;
  client_id: string;
  doc_type: DocumentType;
  residence_proof_type: ResidenceProof | null;
  file_path: string;
  uploaded_at: string;
};

export type StatusHistory = {
  id: string;
  application_id: string;
  old_status: ApplicationStatus | null;
  new_status: ApplicationStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
};

export type NotificationRecord = {
  id: string;
  client_id: string;
  application_id: string | null;
  channel: string;
  message: string;
  status: string;
  created_at: string;
};

export type WhatsAppButtonReply = {
  id: string;
  client_id: string | null;
  phone: string;
  button_id: string;
  button_title: string;
  wa_message_id: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      credit_applications: {
        Row: CreditApplication;
        Insert: Omit<
          CreditApplication,
          "id" | "status" | "admin_notes" | "approved_amount" | "reviewed_by" | "reviewed_at" | "created_at"
        >;
        Update: Partial<CreditApplication>;
        Relationships: [];
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, "id" | "uploaded_at">;
        Update: Partial<Document>;
        Relationships: [];
      };
      status_history: {
        Row: StatusHistory;
        Insert: Omit<StatusHistory, "id" | "created_at">;
        Update: Partial<StatusHistory>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRecord;
        Insert: Omit<NotificationRecord, "id" | "created_at">;
        Update: Partial<NotificationRecord>;
        Relationships: [];
      };
      whatsapp_button_replies: {
        Row: WhatsAppButtonReply;
        Insert: Omit<WhatsAppButtonReply, "id" | "created_at">;
        Update: Partial<WhatsAppButtonReply>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
};
