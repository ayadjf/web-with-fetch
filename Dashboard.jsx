import React, { useEffect, useState } from "react";
import "./Dashboard.css"; // Import your CSS file for styling
import { BarChart2 } from "lucide-react"; // Optional library

import {
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Cell as BarCell,
  ReferenceLine,
} from "recharts";

const Dashboard = () => {
  // State for storing fetched data
  const [questionSuccessRate, setQuestionSuccessRate] = useState([]);
  const [choicePercentages, setChoicePercentages] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Data for Pie Chart
  const pieData = [
    { name: "Over 10", value: 80 },
    { name: "Less than 10", value: 20 },
  ];

  const students = [
    { id: 1, name: 'Benali Sara', grade: 14 },
    { id: 2, name: 'Hayeg Ola', grade: 16 },
    { id: 3, name: 'Zouak Syrine', grade: 16 },
    { id: 4, name: 'Farah Assia', grade: 16 },
    { id: 5, name: 'D39K254', grade: 10 },
    { id: 6, name: 'D39K253', grade: 4 },
    { id: 7, name: 'D39K252', grade: 17 },
    { id: 8, name: 'D39K251', grade: 8 },
  ];

  const COLORS = ["#184F78", "#CBD5E1"];

  // Data for Bar Chart
  const barData = Array.from({ length: 12 }, (_, i) => ({
    name: `Q${i + 1}`,
    value: Math.floor(Math.random() * 15),
  }));
  barData[5].value = 13; // Highlighted bar

  // Fetch Question Success Rate Data
  async function fetchQuestionSuccessRate(quiz_id) {
    try {
      const response = await fetch('http://localhost:5000/api/teachers/quizQuestionChoicePercentage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ quiz_id })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error:", data.message);
        return;
      }

      console.log("Results:", data.questionNpercentage);
      setQuestionSuccessRate(data.questionNpercentage); // Save the data to state

    } catch (error) {
      console.error("🔥 Fetch error:", error);
    }
  }

  // Fetch Choice Percentages for each Question
  async function fetchChoicePercentages(question_id) {
    try {
      const response = await fetch('http://localhost:5000/api/teachers/quizQuestionSuccessRate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ question_id })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Error:", data.message);
        return;
      }

      console.log("Answer Percentages:", data.answersPercentages);
      setChoicePercentages(data.answersPercentages); // Save the data to state

    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  // Call fetching functions when the component mounts
  useEffect(() => {
    // Call these functions with appropriate IDs (quiz_id or question_id)
    fetchQuestionSuccessRate(1); // Example quiz_id
    fetchChoicePercentages(1);  // Example question_id

    setLoading(false); // Update loading state when data is fetched
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="dashboard-cards">
        {/* Pie Chart Card */}
        <div className="dashboard-card">
          <h3 className="card-title">Question Grades Distribution</h3>
          <div className="chart-center">
            <PieChart width={250} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="custom-legend">
            {pieData.map((entry, index) => (
              <div key={index} className="legend-item">
                <span
                  className="legend-color"
                  style={{ backgroundColor: COLORS[index] }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="dashboard-card">
          <h3 className="card-title">Questions Grade</h3>

          {/* Chart Icon Top-Right */}
          <div className="chart-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 3v18M10 10v11M15 6v15M20 14v7"
                stroke="#4318FF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <Tooltip />

              <ReferenceLine
                y={Math.max(...barData.map(d => d.value))}
                stroke="#4318FF"
                strokeDasharray="6 6"
                label={{
                  value: "13",
                  position: "right",
                  fill: "#4318FF",
                  fontSize: 14,
                  dy: -10,
                  dx: -20,
                }}
              />

              <Bar dataKey="value" barSize={35}>
                {barData.map((entry, index) => (
                  <BarCell
                    key={index}
                    fill={index === 5 ? "#184F78" : "#CBD5E1"}
                    radius={[8, 8, 0, 0]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Grades Table */}
      <div className="student-list-container">
        <h2>Student Grades</h2>
        <table className="student-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Grade</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.grade}</td>
                <td>
                  <button className="open-btn">Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
