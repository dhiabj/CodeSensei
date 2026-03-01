export interface Review {
  reviewResult: string;
  code: string;
  language: string;
  _id: string;
  title: string;
  createdAt: string;
}

export interface ReviewHistoryItem {
  _id: string;
  title: string;
  createdAt: string;
}
