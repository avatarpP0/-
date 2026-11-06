export type Language = 'ar' | 'en';

export interface PracticeArea {
  id: string;
  title: string;
  titleEn: string;
  iconName: string;
  description: string;
  descriptionEn: string;
  keyPoints: string[];
  keyPointsEn: string[];
  leadAttorney: string;
  leadAttorneyEn: string;
  avgDuration: string;
  avgDurationEn: string;
  startingFee: number;
  casesCount: number;
}

export interface Attorney {
  id: string;
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  experienceYears: number;
  education: string;
  educationEn: string;
  specializations: string[];
  specializationsEn: string[];
  image: string;
  email: string;
  phone: string;
  bio: string;
  bioEn: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  titleEn: string;
  practiceAreaId: string;
  outcome: string;
  outcomeEn: string;
  amount: string;
  amountEn: string;
  summary: string;
  summaryEn: string;
  year: number;
  clientType: string;
  clientTypeEn: string;
}

export interface ConsultationRequest {
  id: string;
  referenceNumber: string;
  clientName: string;
  email: string;
  phone: string;
  companyName?: string;
  serviceType: string;
  complexity: 'standard' | 'medium' | 'high';
  urgency: 'normal' | 'urgent';
  meetingType: 'in_person' | 'virtual' | 'encrypted_call';
  preferredDate: string;
  preferredTime: string;
  attorneyId?: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  estimatedFee: number;
  adminNotes?: string;
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
}

export interface FirmSettings {
  firmNameAr: string;
  firmNameEn: string;
  sloganAr: string;
  sloganEn: string;
  phone: string;
  email: string;
  addressAr: string;
  addressEn: string;
  licenseNumber: string;
  casesWonPercent: number;
  totalDisputeValueSAR: string;
  yearsExperience: number;
  corporateClientsCount: number;
}
