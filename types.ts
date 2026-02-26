
export interface LocationData {
  latitude?: number;
  longitude?: number;
  manualAddress?: string;
  isManual: boolean;
}

export interface IncidentReport {
  id: string;
  timestamp: number;
  description: string;
  image: string; // Base64
  location: LocationData;
  status: 'pending' | 'sent' | 'archived';
  severityAnalysis?: string;
  informantName: string;
  informantPhone: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
