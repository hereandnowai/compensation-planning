
export interface Employee {
  employee_id: string;
  name: string;
  department: string;
  role: string;
  current_salary: number;
  experience_years: number;
  performance_rating: number;
  location: string;
}

export interface AnalyzedEmployee extends Employee {
  market_salary_min: number;
  market_salary_max: number;
  pay_status: 'Underpaid' | 'Fairly Paid' | 'Overpaid';
  suggested_salary: number;
  justification: string;
}

export interface AnalysisResult {
  analyzed_employees: AnalyzedEmployee[];
  equity_score: number;
  summary: string;
  pay_status_distribution: {
    underpaid_count: number;
    fairly_paid_count: number;
    overpaid_count: number;
  };
  salary_by_department: { name: string; avgSalary: number }[];
}

export interface BoxPlotData {
    name: string;
    boxPlot: [number, number, number, number, number]; // min, q1, median, q3, max
}
