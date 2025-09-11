export interface EventImage {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string; // ISO date string
  imageUrls: string[];
  uploadedByUserId: string;
  uploadedByUserName: string;
}

export interface EventImagesResponse {
  statusCode: number;
  isSuccess: boolean;
  data: EventImage[];
  message: string;
  errors: string[];
}

export interface AddEventImagesRequest {
  eventId: string;
  imageUrls: string[];
}

export interface DeleteEventImagesRequest {
  id: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  isSuccess: boolean;
  data: T;
  message: string;
  errors: string[];
}
