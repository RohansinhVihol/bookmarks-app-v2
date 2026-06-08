export type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  handle: string;
  created_at: string;
};
