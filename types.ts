export enum LineType {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  SYSTEM = 'SYSTEM',
  ERROR = 'ERROR',
  AI = 'AI'
}

export interface TerminalLine {
  id: string;
  type: LineType;
  content: React.ReactNode;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  status: string;
  features: string[];
}

export type CameraTarget = 'IDLE' | 'PROJECTS' | 'ABOUT' | 'CONTACT';
export type Language = 'en' | 'ko';

export interface CommandResponse {
  output: React.ReactNode;
  target?: CameraTarget;
}