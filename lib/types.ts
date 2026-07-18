export type Student = {
  id: string;
  full_name: string;
  department: string | null;
  favorite_scripture: string | null;
  testimony: string | null;
  portrait_url: string | null;
  created_at: string;
  approved: boolean;
};

export type Photo = {
  id: string;
  student_id: string | null;
  image_url: string;
  caption: string | null;
  created_at: string;
};

export type MemoryWallMessage = {
  id: string;
  author_name: string;
  message: string;
  approved: boolean;
  created_at: string;
};

export type Letter = {
  id: string;
  student_id: string;
  letter_text: string;
  unlock_date: string;
  created_at: string;
};
