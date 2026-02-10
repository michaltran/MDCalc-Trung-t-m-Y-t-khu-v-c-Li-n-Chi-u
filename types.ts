
export type Specialty = 
  | 'Tim mạch' 
  | 'Hồi sức cấp cứu' 
  | 'Nội tiết' 
  | 'Tiêu hóa' 
  | 'Thận học' 
  | 'Thần kinh' 
  | 'Sản phụ khoa' 
  | 'Nhi khoa'
  | 'Hô hấp'
  | 'Ung bướu'
  | 'Ngoại tiết niệu';

export type InputType = 'boolean' | 'select' | 'number';

export interface CalculatorInput {
  id: string;
  label: string;
  type: InputType;
  options?: { label: string; value: number; displayValue?: string }[];
  defaultValue?: number;
  unit?: string;
  helpText?: string;
}

export interface Creator {
  name: string;
  title?: string;
  image?: string;
}

export interface LiteratureItem {
  type: 'original' | 'validation' | 'outcomes' | 'guideline' | 'other';
  title: string;
  citation: string;
  pubmedId?: string;
}

export interface Calculator {
  id: string;
  name: string;
  description: string;
  specialties: Specialty[];
  inputs: CalculatorInput[];
  calculate: (values: Record<string, number>) => { 
    score: number; 
    interpretation: string; 
    color: string;
    details?: string;
  };
  whenToUse?: string[];
  pearls?: string[];
  whyUse?: string;
  nextSteps?: {
    advice?: string[];
    management?: {
      title: string;
      content: string;
      bullets?: string[];
    }[];
    criticalActions?: string;
  };
  evidenceContent?: {
    formula?: {
      criteria: string;
      subCriteria?: { label: string; points: string }[];
      points?: string;
    }[];
    factsFigures?: {
      score: number;
      ischemicRisk?: string; // Reuse or generalize for RCC
      totalRisk?: string;
      survival5yr?: string;
      survival10yr?: string;
    }[];
    appraisal?: string[];
    literature?: LiteratureItem[];
  };
  creatorInsights?: string;
  creator?: Creator;
  contributors?: string[];
  relatedIds?: string[];
}
