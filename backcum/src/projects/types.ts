export interface Project {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
}

export type DiagramType = 'class' | 'sequence' | 'usecase' | 'component' | 'package';

export interface Diagram {
  type: DiagramType;
  json: any;
}

export interface DiagramsByType {
  class?: any;
  sequence?: any;
  usecase?: any;
  component?: any;
  package?: any;
} 