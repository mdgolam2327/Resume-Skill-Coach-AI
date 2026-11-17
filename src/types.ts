export interface SkillGapData {
  have: string[];
  develop: string[];
  roleSkills: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  estimatedTime?: string;
  keyTopics?: string[];
}

export interface ProjectIdea {
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  resumeTip: string;
}

export interface LearningRoadmap {
  learnFirst: RoadmapStep[];
  learnNext: RoadmapStep[];
  projects: ProjectIdea[];
}

export interface WordingImprovement {
  section: string;
  original: string;
  improved: string;
  reason: string;
}

export interface AnalysisResult {
  matchScore: number;
  scoreLevel: string;
  scoreSummary: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skillGap: SkillGapData;
  roadmap: LearningRoadmap;
  wordingImprovements: WordingImprovement[];
  extractedProfileName?: string;
  isRateLimitedFallback?: boolean;
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export interface CareerPreset {
  title: string;
  category: string;
  popularSkills: string[];
  description: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  size: string;
  base64: string;
  mimeType: string;
  category: 'pdf' | 'image' | 'word' | 'text' | 'other';
  formatLabel: string;
  previewUrl?: string;
  extractedText?: string;
}

