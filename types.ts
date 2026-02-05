
export type Specialty = 
  | 'Tim mạch' 
  | 'Hồi sức cấp cứu' 
  | 'Nội tiết' 
  | 'Tiêu hóa' 
  | 'Thận học' 
  | 'Thần kinh' 
  | 'Sản phụ khoa' 
  | 'Nhi khoa'
  | 'Hô hấp';

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
  evidence?: string;
  whenToUse?: string;
  pearls?: string;
  whyUse?: string;
  creator?: Creator;
  relatedIds?: string[];
}
