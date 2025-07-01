
import { GoogleGenAI } from "@google/genai";
import { Employee, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonString = (str: string): string => {
    let jsonStr = str.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    return jsonStr;
};

export const analyzeCompensationData = async (employees: Employee[]): Promise<AnalysisResult> => {
    const prompt = `
        You are an expert HR compensation analyst. Your task is to analyze the provided employee data. 
        The currency is not specified, so assume it is consistent across the dataset and provide analysis in the same units (e.g., if salary is in ₹, your suggestions should be in ₹).
        
        Analyze the following employee data:
        ${JSON.stringify(employees, null, 2)}

        Perform the following analysis and return the result as a single JSON object.

        1.  **Full Employee Analysis**: For each employee, perform a detailed analysis.
            -   Estimate a fair market salary range (min and max) based on their role, experience, and location.
            -   Compare their current salary to this market range and categorize them as 'Underpaid', 'Fairly Paid', or 'Overpaid'.
            -   Suggest a new salary if an adjustment is needed. The suggested salary should be a concrete number.
            -   Provide a brief justification for your recommendation.

        2.  **Overall Equity Score**: Calculate an overall equity score for the company from 0 to 100, where 100 represents perfect pay equity and fairness.

        3.  **Executive Summary**: Write a brief summary of your key findings, highlighting major trends or issues.

        4.  **Pay Status Distribution**: Count the number of employees in each category ('Underpaid', 'Fairly Paid', 'Overpaid').

        5.  **Salary by Department**: Calculate the average salary for each department.

        **JSON Output Format Rules:**
        You MUST follow these rules for your response:
        1.  The response MUST be a single, valid JSON object and NOTHING else. No extra text, no explanations, no markdown.
        2.  All property names (keys) in the JSON object MUST be enclosed in double quotes (e.g., "employee_id").
        3.  All string values MUST be enclosed in double quotes.
        4.  Any double quotes inside a string value MUST be escaped with a backslash (e.g., "a string with a \\"quote\\"").
        5.  There must NOT be any trailing commas after the last element in an object or array.

        **JSON Structure:**
        The JSON object must conform to this exact structure:
        \`\`\`json
        {
          "analyzed_employees": [
            {
              "employee_id": "string",
              "name": "string",
              "department": "string",
              "role": "string",
              "current_salary": number,
              "experience_years": number,
              "performance_rating": number,
              "location": "string",
              "market_salary_min": number,
              "market_salary_max": number,
              "pay_status": "Underpaid" | "Fairly Paid" | "Overpaid",
              "suggested_salary": number,
              "justification": "string"
            }
          ],
          "equity_score": number,
          "summary": "string",
          "pay_status_distribution": {
            "underpaid_count": number,
            "fairly_paid_count": number,
            "overpaid_count": number
          },
          "salary_by_department": [
            { "name": "string", "avgSalary": number }
          ]
        }
        \`\`\`
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                temperature: 0.2,
            },
        });
        
        const jsonString = cleanJsonString(response.text);
        const result: AnalysisResult = JSON.parse(jsonString);
        return result;

    } catch (error) {
        console.error("Error analyzing compensation data:", error);
        throw new Error("Failed to get analysis from AI. Please check the data format or try again later.");
    }
};
