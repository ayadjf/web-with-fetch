import React, { useState } from 'react';
import { FaClock, FaPlus, FaTimes, FaCalendarAlt } from 'react-icons/fa';
import './Content.css';

const CreateQuiz = () => {
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      text: '',
      options: [''],
      grade: '',
      period: '',
    },
  ]);
  const [level, setLevel] = useState('');
  const [sections, setSections] = useState([]);
  const [groups, setGroups] = useState([]);
  const [module, setModule] = useState('');
  const [students, setStudents] = useState('');
  const [timingBy, setTimingBy] = useState('');
  const [questionVisibility, setQuestionVisibility] = useState('');
  const [quizDuration, setQuizDuration] = useState(''); // for quiz timing duration

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        text: '',
        options: [''],
        grade: '',
        period: '',
      },
    ]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const handleOptionChange = (qId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options: q.options.map((opt, i) => (i === index ? value : opt)),
            }
          : q
      )
    );
  };

  const addOption = (qId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId ? { ...q, options: [...q.options, ''] } : q
      )
    );
  };

  const removeOption = (qId, index) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId
          ? {
              ...q,
              options:
                q.options.length > 1
                  ? q.options.filter((_, i) => i !== index)
                  : q.options,
            }
          : q
      )
    );
  };

  const updateQuestionField = (qId, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === qId ? { ...q, [field]: value } : q))
    );
  };

  const handleCheckboxChange = (value, selected, setSelected) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const quizData = {
      module,
      level,
      sections,
      groups,
      students,
      timingBy,
      questionVisibility,
      questions,
    };

    try {
      const response = await fetch('http://localhost:5000/api/createQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message); // Handle success message
      } else {
        alert('Error creating quiz');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to the server');
    }
  };

  return (
    <div className="create-quiz-wrapper">
      <div className="quiz-container">
        <h2>Create Quiz</h2>

        <form className="quiz-form" onSubmit={handleSubmit}>
          {/* Quiz Form Fields */}

          <div className="top-inputs">
            <div className="form-control">
              <label>Module :</label>
              <select
                id="module"
                value={module}
                onChange={(e) => setModule(e.target.value)}
              >
                <option value="">Select Module</option>
                <option value="POO">POO</option>
                <option value="LOGM">LOGM</option>
                <option value="ANAL4">ANAL4</option>
                <option value="PRST2">PRST2</option>
              </select>
            </div>

            <div className="form-control">
              <label>Level :</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={level ? 'selected' : 'placeholder'}
              >
                <option value="">Select level</option>
                <option value="1CP">1CP</option>
                <option value="2CP">2CP</option>
                <option value="1CS">1CS</option>
                <option value="2CS">2CS</option>
                <option value="3CS">3CS</option>
              </select>
            </div>

            
            <div className="form-control">
              <label>Timing By:</label>
              <select
                value={timingBy}
                onChange={(e) => setTimingBy(e.target.value)}
              >
                <option value="">Select</option>
                <option value="question">Question</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            {timingBy === 'quiz' && (
              <div className="form-control">
                <label>Quiz Duration:</label>
                <input
                  type="text"
                  placeholder="hh:mm:ss"
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(e.target.value)}
                />
              </div>
            )}

            <div className="form-control">
              <label>Question:</label>
              <select
                value={questionVisibility}
                onChange={(e) => setQuestionVisibility(e.target.value)}
              >
                <option value="">Select</option>
                <option value="show">Show</option>
                <option value="hide">Hide</option>
              </select>
            </div>
          </div>

          {level && (
            <div className="top-inputs">
              <div className="form-control">
                <label>Section(s):</label>
                <div className="checkbox-group">
                  {['A', 'B', 'C', 'D'].map((section) => (
                    <label key={section}>
                      <input
                        type="checkbox"
                        value={section}
                        checked={sections.includes(section)}
                        onChange={() =>
                          handleCheckboxChange(section, sections, setSections)
                        }
                      />
                      Section {section}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-control">
                <label>Group(s):</label>
                <div className="checkbox-group">
                  {[...Array(13)].map((_, i) => {
                    const groupValue = `Group ${i + 1}`;
                    return (
                      <label key={groupValue}>
                        <input
                          type="checkbox"
                          value={groupValue}
                          checked={groups.includes(groupValue)}
                          onChange={() =>
                            handleCheckboxChange(groupValue, groups, setGroups)
                          }
                        />
                        {groupValue}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="students">Students (emails):</label>
            <input
              type="text"
              id="students"
              placeholder="email1@example.com, email2@example.com"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
            />
          </div>

          {/* Question fields */}
          {questions.map((question, index) => (
            <div className="question-box small" key={question.id}>
<div className="question-header">
                <h4>Question {index + 1}</h4>
                <div className="grade-box">
                  <label>Grade :</label>
                  <input
                    placeholder="1 points"
                    type="text"
                    value={question.grade}
                    onChange={(e) =>
                      updateQuestionField(question.id, 'grade', e.target.value)
                    }
                  />
                </div>
                {index === questions.length - 1 && (
                  <div
                    className="remove-question-top"
                    onClick={() => removeQuestion(question.id)}
                  >
                    <FaTimes />
                  </div>
                )}
              </div>

              <input
                type="text"
                value={question.text}
                onChange={(e) =>
                  updateQuestionField(question.id, 'text', e.target.value)
                }
                placeholder="Enter the question"
                className="question-input"
              />

              <div className="options">
                {question.options.map((opt, i) => (
                  <div className="option-row" key={i}>
                    <input type="radio" name={`q${index}`} />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(question.id, i, e.target.value)
                      }
                      placeholder={`Option ${i + 1}`}
                    />
                    {question.options.length > 1 && (
                      <button
                        type="button"
                        className="remove-option"
                        onClick={(e) => {
                          e.preventDefault();
                          removeOption(question.id, i);
                        }}
                      >
                        ✖
                      </button>
                    )}
                  </div>
                ))}
                <div
                  className="option-row add-option"
                  onClick={() => addOption(question.id)}
                >
                  <input type="radio" disabled />
                  <span>Add option</span>
                </div>
              </div>

              {timingBy === 'question' && (
               <div className="period">
                               <FaClock />
                               <label>Period:</label>
                               <input
                                 type="text"
                                 value={question.period}
                                 onChange={(e) =>
                                   updateQuestionField(question.id, 'period', e.target.value)
                                 }
                                 placeholder="hh:mm:ss"
                               />
                             </div>
              )}       </div>
          ))}

          <div className="add-question-wrapper">
            <button type="button" className="add-question-btn" onClick={addQuestion}>
              <FaPlus />
            </button>
          </div>

          {/* Date and Time Input */}
          <div className="bottom-row">
            <FaClock />
            <label>Time:</label>
            <input type="text" placeholder="hh:mm:ss" />
            <FaCalendarAlt />
            <label>Date:</label>
            <input type="date" />

            <button className="finish-btn">Finish</button>
<button type="delete" className="delete-btn">
              Delete
            </button>
          </div>

          
          
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
