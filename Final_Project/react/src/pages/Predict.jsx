import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { clearCurrentPrediction, clearError, makePrediction } from '../store/predictionSlice';

const Predict = () => {
  const [formData, setFormData] = useState({
    gender: 'female',
    race_ethnicity: 'group A',
    parental_education: "bachelor's degree",
    lunch: 'standard',
    test_preparation: 'none',
    math_score: 70,
    reading_score: 70,
    writing_score: 70,
  });

  const dispatch = useDispatch();
  const { currentPrediction, loading, error } = useSelector((state) => state.prediction);

  useEffect(() => {
    dispatch(clearCurrentPrediction());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(makePrediction(formData));
    if (result.type === 'prediction/make/fulfilled') {
      toast.success('Prediction completed successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      gender: 'female',
      race_ethnicity: 'group A',
      parental_education: "bachelor's degree",
      lunch: 'standard',
      test_preparation: 'none',
      math_score: 70,
      reading_score: 70,
      writing_score: 70,
    });
    dispatch(clearCurrentPrediction());
  };

  const getPerformanceColor = (performance) => {
    const colors = {
      'High': 'text-green-600 bg-green-100',
      'Medium': 'text-yellow-600 bg-yellow-100',
      'Low': 'text-red-600 bg-red-100',
    };
    return colors[performance] || 'text-gray-600 bg-gray-100';
  };

  const getPerformanceIcon = (performance) => {
    const icons = {
      'High': '🎉',
      'Medium': '📈',
      'Low': '📉',
    };
    return icons[performance] || '📊';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-gradient p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -translate-x-12 translate-y-12"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <span className="text-2xl">🔮</span>
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">AI Performance Prediction</h1>
            <p className="text-blue-100 mt-1 text-xs lg:text-sm">
              Enter student information to predict their academic performance level
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
              <span className="text-white text-sm">📋</span>
            </div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">Student Information</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  👤 Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  🌍 Race/Ethnicity
                </label>
                <select
                  name="race_ethnicity"
                  value={formData.race_ethnicity}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="group A">Group A</option>
                  <option value="group B">Group B</option>
                  <option value="group C">Group C</option>
                  <option value="group D">Group D</option>
                  <option value="group E">Group E</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">
                🎓 Parental Level of Education
              </label>
              <select
                name="parental_education"
                value={formData.parental_education}
                onChange={handleChange}
                className="form-select"
              >
                <option value="bachelor's degree">Bachelor's Degree</option>
                <option value="some college">Some College</option>
                <option value="master's degree">Master's Degree</option>
                <option value="associate's degree">Associate's Degree</option>
                <option value="high school">High School</option>
                <option value="some high school">Some High School</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">
                  🍽️ Lunch Program
                </label>
                <select
                  name="lunch"
                  value={formData.lunch}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="standard">Standard</option>
                  <option value="free/reduced">Free/Reduced</option>
                </select>
              </div>

              <div>
                <label className="form-label">
                  📚 Test Preparation Course
                </label>
                <select
                  name="test_preparation"
                  value={formData.test_preparation}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="none">None</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="form-label">
                  🧮 Math Score (0-100)
                </label>
                <input
                  type="number"
                  name="math_score"
                  value={formData.math_score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="Enter math score"
                />
              </div>

              <div>
                <label className="form-label">
                  📖 Reading Score (0-100)
                </label>
                <input
                  type="number"
                  name="reading_score"
                  value={formData.reading_score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="Enter reading score"
                />
              </div>

              <div>
                <label className="form-label">
                  ✍️ Writing Score (0-100)
                </label>
                <input
                  type="number"
                  name="writing_score"
                  value={formData.writing_score}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="form-input"
                  placeholder="Enter writing score"
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing with AI...
                  </span>
                ) : (
                  '🔮 Predict Performance'
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>

        {/* Prediction Result */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg mr-3">
              <span className="text-white text-sm">🎯</span>
            </div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-800">AI Prediction Result</h2>
          </div>
          
          {currentPrediction ? (
            <div className="space-y-8">
              <div className="text-center">
                <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg lg:text-xl font-bold shadow-lg transform hover:scale-105 transition-transform ${
                  currentPrediction.prediction === 'High' ? 'performance-high' :
                  currentPrediction.prediction === 'Medium' ? 'performance-medium' : 'performance-low'
                }`}>
                  <span className="mr-3 text-3xl">{getPerformanceIcon(currentPrediction.prediction)}</span>
                  {currentPrediction.prediction} Performance
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <p className="text-gray-700 font-semibold text-lg">
                    AI Confidence: {(currentPrediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                  <span className="mr-2">📊</span>
                  Input Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">👤 Gender:</span> 
                    <span className="font-semibold">{currentPrediction.input_data.gender}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">🌍 Race/Ethnicity:</span> 
                    <span className="font-semibold">{currentPrediction.input_data['race/ethnicity']}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">🎓 Parent Education:</span> 
                    <span className="font-semibold">{currentPrediction.input_data['parental level of education']}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">🍽️ Lunch:</span> 
                    <span className="font-semibold">{currentPrediction.input_data.lunch}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">📚 Test Prep:</span> 
                    <span className="font-semibold">{currentPrediction.input_data['test preparation course']}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">🧮 Math:</span> 
                    <span className="font-semibold">{currentPrediction.input_data['math score']}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">📖 Reading:</span> 
                    <span className="font-semibold">{currentPrediction.input_data['reading score']}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg">
                    <span className="font-medium text-gray-600">✍️ Writing:</span> 
                    <span className="font-semibold">{currentPrediction.input_data['writing score']}</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl p-6 border-l-4 ${
                currentPrediction.prediction === 'High' ? 'bg-green-50 border-green-400' :
                currentPrediction.prediction === 'Medium' ? 'bg-yellow-50 border-yellow-400' : 'bg-red-50 border-red-400'
              }`}>
                <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center">
                  <span className="mr-2">💡</span>
                  AI Interpretation
                </h3>
                <p className={`text-lg ${
                  currentPrediction.prediction === 'High' ? 'text-green-800' :
                  currentPrediction.prediction === 'Medium' ? 'text-yellow-800' : 'text-red-800'
                }`}>
                  {currentPrediction.prediction === 'High' && 
                    "🎉 This student shows strong academic potential with excellent performance indicators. They are likely to excel in their studies!"
                  }
                  {currentPrediction.prediction === 'Medium' && 
                    "📈 This student demonstrates solid academic performance with room for improvement. With proper support, they can achieve higher levels!"
                  }
                  {currentPrediction.prediction === 'Low' && 
                    "📉 This student may benefit from additional academic support and intervention strategies. Early support can make a significant difference!"
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🔮</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Ready for AI Analysis</h3>
              <p className="text-lg">Enter student information and click "Predict Performance" to see intelligent results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;