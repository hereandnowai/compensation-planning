import React, { useState, useCallback, useMemo, FC, ChangeEvent } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from 'recharts';
import { analyzeCompensationData } from './services/geminiService';
import { Employee, AnalysisResult, AnalyzedEmployee, BoxPlotData } from './types';

// --- BRANDING ---
const BRAND_COLORS = {
  primary: '#FFDF00',
  secondary: '#004040',
};

// --- BRANDED COMPONENTS ---

const Header: FC = () => (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
                <img src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" alt="HERE AND NOW AI Logo" className="h-10 sm:h-12" />
                <p className="hidden sm:block text-sm text-brand-secondary font-medium tracking-wide">
                    designed with passion for innovation
                </p>
            </div>
        </div>
    </header>
);

const socialMediaLinks = {
  blog: "https://hereandnowai.com/blog",
  linkedin: "https://www.linkedin.com/company/hereandnowai/",
  instagram: "https://instagram.com/hereandnow_ai",
  github: "https://github.com/hereandnowai",
  x: "https://x.com/hereandnow_ai",
  youtube: "https://youtube.com/@hereandnow_ai",
  website: "https://hereandnowai.com"
};

const SocialIcon: FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-brand-primary transition-colors">
        {children}
    </a>
);

const Footer: FC = () => (
    <footer className="bg-brand-secondary text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <p className="font-bold text-lg">HERE AND NOW AI</p>
                    <p className="text-sm text-slate-300">Artificial Intelligence Research Institute</p>
                    <p className="mt-2 text-xs text-slate-400">Developed by Sakthi Kannan [ AI Products Engineering Team ]</p>
                </div>
                <div className="flex items-center gap-5">
                    <SocialIcon href={socialMediaLinks.linkedin}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></SocialIcon>
                    <SocialIcon href={socialMediaLinks.github}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></SocialIcon>
                    <SocialIcon href={socialMediaLinks.x}><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg></SocialIcon>
                    <SocialIcon href={socialMediaLinks.youtube}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></SocialIcon>
                </div>
            </div>
            <div className="mt-8 border-t border-slate-700 pt-6 text-center text-sm text-slate-400">
                © {new Date().getFullYear()} HERE AND NOW AI. All rights reserved. | <a href={socialMediaLinks.website} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">Website</a>
            </div>
        </div>
    </footer>
);


// --- ICONS ---
const UploadIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V21h18v-3.75m-18 0V5.625c0-1.036.84-1.875 1.875-1.875h14.25c1.035 0 1.875.84 1.875 1.875v11.625" />
    </svg>
);

const ChartIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1-1.5m0 0l1 1.5m-2-1.5v5.25A2.25 2.25 0 006 21h12a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);

const Loader: FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
        <svg className="animate-spin h-12 w-12 text-brand-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg text-slate-600">AI is analyzing your data. This may take a moment...</p>
    </div>
);


// --- UI HELPER COMPONENTS ---
const StatCard: FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</h3>
        <p className="mt-2 text-4xl font-bold text-brand-secondary">{value}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
);

// --- CSV UTILITIES ---
const parseCSV = (csvText: string): Employee[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) throw new Error("CSV must have a header and at least one data row.");

    const header = lines[0].split(',').map(h => h.trim());
    const requiredHeaders = ['employee_id', 'name', 'department', 'role', 'current_salary', 'experience_years', 'performance_rating', 'location'];
    
    for (const req of requiredHeaders) {
        if (!header.includes(req)) {
            throw new Error(`Missing required CSV column: ${req}`);
        }
    }

    return lines.slice(1).map((line, rowIndex) => {
        const values = line.split(',');
        const employeeObj: any = {};
        header.forEach((h, i) => {
            employeeObj[h] = values[i] ? values[i].trim() : '';
        });

        const salary = parseFloat(employeeObj.current_salary);
        const experience = parseFloat(employeeObj.experience_years);
        const performance = parseFloat(employeeObj.performance_rating);

        if (isNaN(salary) || isNaN(experience) || isNaN(performance)) {
            throw new Error(`Invalid number format in row ${rowIndex + 2}. Check salary, experience, and performance columns.`);
        }

        return {
            ...employeeObj,
            current_salary: salary,
            experience_years: experience,
            performance_rating: performance,
        } as Employee;
    });
};

const exportToCSV = (data: AnalyzedEmployee[], filename: string) => {
    if (data.length === 0) return;
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(','));
    const csvContent = [header, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// --- CHART COMPONENTS ---
const PayStatusPieChart: FC<{ data: AnalysisResult['pay_status_distribution'] }> = ({ data }) => {
    const chartData = [
        { name: 'Underpaid', value: data.underpaid_count },
        { name: 'Fairly Paid', value: data.fairly_paid_count },
        { name: 'Overpaid', value: data.overpaid_count },
    ];
    const COLORS = ['#FBBF24', '#34D399', '#F87171']; // Amber, Green, Red

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value} employees`}/>
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

const SalaryByDeptChart: FC<{ data: AnalysisResult['salary_by_department'] }> = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)} />
            <Tooltip
                cursor={{fill: 'rgba(0, 64, 64, 0.1)'}}
                contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value as number)}
            />
            <Legend wrapperStyle={{ color: BRAND_COLORS.secondary }}/>
            <Bar dataKey="avgSalary" fill={BRAND_COLORS.secondary} name="Average Salary" radius={[4, 4, 0, 0]} />
        </BarChart>
    </ResponsiveContainer>
);

const SalaryVsPerformanceScatterPlot: FC<{ data: AnalyzedEmployee[] }> = ({ data }) => {
    const performanceData = data.map(emp => ({
        x: emp.performance_rating,
        y: emp.current_salary,
        z: emp.experience_years,
        name: emp.name
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" dataKey="x" name="Performance Rating" unit="" stroke="#6b7280" />
                <YAxis type="number" dataKey="y" name="Salary" unit="" stroke="#6b7280" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}/>
                <ZAxis type="number" dataKey="z" name="Experience (Yrs)" range={[60, 400]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => (name === 'Salary' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(value as number) : value)} />
                <Legend />
                <Scatter name="Employees" data={performanceData} fill={BRAND_COLORS.secondary} shape="circle" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

const CustomBoxPlotTooltip: FC<{ active?: boolean, payload?: any[] }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as BoxPlotData;
        if (!data.boxPlot) return null;
        const [min, q1, median, q3, max] = data.boxPlot;
        return (
            <div className="bg-white p-3 shadow-lg rounded-md border border-slate-200 text-sm">
                <p className="font-bold text-slate-800 mb-2">{data.name}</p>
                <ul className="space-y-1">
                    <li className="flex justify-between gap-4"><span className="font-semibold text-slate-500">Max:</span> <span>{new Intl.NumberFormat('en-US').format(max)}</span></li>
                    <li className="flex justify-between gap-4"><span className="font-semibold text-slate-500">Q3:</span> <span>{new Intl.NumberFormat('en-US').format(q3)}</span></li>
                    <li className="flex justify-between gap-4 font-bold"><span className="text-slate-500">Median:</span> <span className="text-brand-secondary">{new Intl.NumberFormat('en-US').format(median)}</span></li>
                    <li className="flex justify-between gap-4"><span className="font-semibold text-slate-500">Q1:</span> <span>{new Intl.NumberFormat('en-US').format(q1)}</span></li>
                    <li className="flex justify-between gap-4"><span className="font-semibold text-slate-500">Min:</span> <span>{new Intl.NumberFormat('en-US').format(min)}</span></li>
                </ul>
            </div>
        );
    }
    return null;
};

const SalaryVsExperienceBoxPlot: FC<{ data: BoxPlotData[] }> = ({ data }) => {
     if (!data || data.length === 0) return <p className="text-slate-500 text-center">Not enough data to create box plot.</p>;
    
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <YAxis type="category" dataKey="name" stroke="#6b7280" width={80} />
                <XAxis type="number" stroke="#6b7280" tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value as number)}/>
                <Tooltip
                    cursor={{fill: 'rgba(0, 64, 64, 0.1)'}}
                    contentStyle={{ background: 'transparent', border: 'none' }}
                    content={<CustomBoxPlotTooltip />}
                 />
                 <Bar dataKey={(d: BoxPlotData) => [d.boxPlot[1], d.boxPlot[3]]} fill="rgba(0, 64, 64, 0.6)" stroke={BRAND_COLORS.secondary} isAnimationActive={false} name="Salary Range (Q1-Q3)" />
                 <Bar dataKey={(d: BoxPlotData) => [d.boxPlot[2], d.boxPlot[2]]} fill={BRAND_COLORS.primary} stroke={BRAND_COLORS.primary} barSize={10} name="Median Salary" />
            </BarChart>
        </ResponsiveContainer>
    );
};


// --- MAIN VIEWS ---
const FileUpload: FC<{ onFileUpload: (content: string) => void; onError: (msg: string) => void; disabled: boolean }> = ({ onFileUpload, onError, disabled }) => {
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (file.type !== 'text/csv') {
                onError("Invalid file type. Please upload a CSV file.");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                onFileUpload(e.target?.result as string);
            };
            reader.onerror = () => {
                onError("Failed to read the file.");
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <label htmlFor="file-upload" className="relative block w-full p-8 text-center border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-brand-primary hover:bg-brand-primary/10 transition-colors duration-300">
                <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
                <span className="mt-4 block text-lg font-semibold text-slate-800">Upload your employee compensation CSV file</span>
                <span className="mt-1 block text-sm text-slate-500">Drag & drop or click to select a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} disabled={disabled} />
            </label>
        </div>
    );
};

const Dashboard: FC<{ result: AnalysisResult; onReset: () => void }> = ({ result, onReset }) => {
    const [activeTab, setActiveTab] = useState('overview');

    const boxPlotData = useMemo<BoxPlotData[]>(() => {
        const experienceBands: { [key: string]: number[] } = {
            '0-2 Yrs': [],
            '3-5 Yrs': [],
            '6-8 Yrs': [],
            '9+ Yrs': [],
        };

        result.analyzed_employees.forEach(emp => {
            const exp = emp.experience_years;
            let band: string;
            if (exp <= 2) band = '0-2 Yrs';
            else if (exp <= 5) band = '3-5 Yrs';
            else if (exp <= 8) band = '6-8 Yrs';
            else band = '9+ Yrs';
            experienceBands[band].push(emp.current_salary);
        });

        const getQuantiles = (arr: number[]): [number, number, number, number, number] | null => {
            if (arr.length < 2) return null;
            const sorted = [...arr].sort((a, b) => a - b);
            const min = sorted[0];
            const max = sorted[sorted.length - 1];
            const q1 = sorted[Math.floor(sorted.length / 4)];
            const median = sorted[Math.floor(sorted.length / 2)];
            const q3 = sorted[Math.floor((sorted.length * 3) / 4)];
            return [min, q1, median, q3, max];
        };
        
        return Object.entries(experienceBands)
            .map(([name, salaries]) => ({ name, quantiles: getQuantiles(salaries) }))
            .filter(d => d.quantiles !== null)
            .map(d => ({ name: d.name, boxPlot: d.quantiles! }));

    }, [result.analyzed_employees]);
    
    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <StatCard title="Overall Equity Score" value={result.equity_score} description="Score from 0 (low) to 100 (high)" />
                            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                                <h3 className="text-lg font-semibold text-slate-800">AI Summary</h3>
                                <p className="mt-2 text-slate-600 whitespace-pre-wrap">{result.summary}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                            <h3 className="text-lg font-semibold text-slate-800 mb-4">Pay Status Distribution</h3>
                            <PayStatusPieChart data={result.pay_status_distribution} />
                        </div>
                    </div>
                );
            case 'visualizations':
                return (
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                             <h3 className="text-lg font-semibold text-slate-800 mb-4">Average Salary by Department</h3>
                             <SalaryByDeptChart data={result.salary_by_department} />
                        </div>
                         <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                             <h3 className="text-lg font-semibold text-slate-800 mb-4">Salary vs. Performance</h3>
                             <SalaryVsPerformanceScatterPlot data={result.analyzed_employees} />
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
                             <h3 className="text-lg font-semibold text-slate-800 mb-4">Salary vs. Experience</h3>
                             <SalaryVsExperienceBoxPlot data={boxPlotData} />
                        </div>
                    </div>
                );
            case 'report':
                return <ReportTable data={result.analyzed_employees} />;
            default:
                return null;
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <ChartIcon className="w-8 h-8 text-brand-secondary" />
                    Compensation Analysis Report
                </h1>
                <button onClick={onReset} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition">Analyze New File</button>
            </div>
            
            <div className="mb-6 border-b border-slate-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {['overview', 'visualizations', 'report'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab ? 'border-brand-primary text-brand-secondary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>{renderContent()}</div>
        </div>
    );
};

const ReportTable: FC<{ data: AnalyzedEmployee[] }> = ({ data }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Underpaid': return 'bg-amber-100 text-amber-800';
            case 'Overpaid': return 'bg-red-100 text-red-800';
            default: return 'bg-green-100 text-green-800';
        }
    };
    return (
        <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Employee Compensation Details</h3>
                <button onClick={() => exportToCSV(data, 'compensation_analysis_report.csv')} className="px-4 py-2 bg-brand-secondary text-white rounded-md hover:opacity-90 transition">Export CSV</button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            {['Name', 'Role', 'Department', 'Current Salary', 'Pay Status', 'Suggested Salary', 'Justification'].map(h => (
                                <th key={h} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {data.map(emp => (
                            <tr key={emp.employee_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{emp.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{emp.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{emp.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Intl.NumberFormat().format(emp.current_salary)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(emp.pay_status)}`}>
                                        {emp.pay_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-semibold">{new Intl.NumberFormat().format(emp.suggested_salary)}</td>
                                <td className="px-6 py-4 whitespace-normal text-sm text-slate-500 max-w-xs">{emp.justification}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- APP COMPONENT ---
export const App: FC = () => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = useCallback(async (csvText: string) => {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const employees = parseCSV(csvText);
            if (employees.length === 0) {
                 throw new Error("CSV file is empty or contains no data rows.");
            }
            const result = await analyzeCompensationData(employees);
            setAnalysisResult(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    const handleReset = () => {
        setAnalysisResult(null);
        setError(null);
        setIsLoading(false);
    }
    
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
            <Header />
            <main className="flex-grow w-full">
                {analysisResult ? (
                    <Dashboard result={analysisResult} onReset={handleReset} />
                ) : (
                    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                        <header className="text-center mb-12 max-w-3xl">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tight">Compensation Planning AI</h1>
                            <p className="mt-4 text-lg text-slate-600">
                               Upload your employee CSV to analyze internal pay equity, benchmark against market rates, identify gaps, and receive data-driven salary suggestions.
                            </p>
                        </header>

                        {isLoading ? (
                            <Loader />
                        ) : (
                            <>
                                <FileUpload onFileUpload={handleFileUpload} onError={setError} disabled={isLoading} />
                                {error && (
                                    <div className="mt-6 w-full max-w-2xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                        <strong className="font-bold">Error: </strong>
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};