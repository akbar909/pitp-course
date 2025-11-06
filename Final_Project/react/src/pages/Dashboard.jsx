import {
  ArrowRight,
  BarChart3,
  Brain,
  History,
  Settings,
  Star,
  Target,
  TrendingUp,
  User
} from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getStats, getUserPredictions } from '../store/predictionSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { predictions, stats } = useSelector((state) => state.prediction);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserPredictions());
    dispatch(getStats());
  }, [dispatch]);

  const COLORS = {
    'High': '#10B981',
    'Medium': '#F59E0B',
    'Low': '#EF4444',
  };

  const pieData = Object.entries(stats.performance_distribution).map(([key, value]) => ({
    name: key,
    value,
    color: COLORS[key],
  }));

  const recentPredictions = predictions.slice(0, 5);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPerformanceColor = (performance) => {
    return COLORS[performance] || '#6B7280';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-gradient p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -translate-x-12 translate-y-12"></div>
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-2 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            <Brain className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">
              Welcome back, {user?.username}! 👋
            </h1>
            <p className="text-blue-100 mt-1 text-xs lg:text-sm">
              Here's your AI prediction dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 border-l-4 border-blue-500 hover:border-blue-600 transform hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Total Predictions</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{stats.total_predictions}</p>
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-emerald-500 hover:border-emerald-600 transform hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Average Confidence</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">{(stats.average_confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-purple-500 hover:border-purple-600 transform hover:-translate-y-1 transition-all duration-300 group">
          <div className="flex items-center">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg group-hover:shadow-xl transition-shadow">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Most Common</p>
              <p className="text-2xl font-bold text-gray-900 mt-0.5">
                {Object.entries(stats.performance_distribution).reduce((a, b) => 
                  stats.performance_distribution[a[0]] > stats.performance_distribution[b[0]] ? a : b, ['None', 0])[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution Chart */}
        <div className="card p-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Performance Distribution</h2>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-lg font-medium mb-2">No predictions yet</p>
                <Link to="/predict" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                  Make your first prediction
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Predictions */}
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3">
                <History className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Recent Predictions</h2>
            </div>
            <Link to="/predict" className="btn-primary flex items-center text-sm px-2 py-2">
              New Prediction
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {recentPredictions.length > 0 ? (
            <div className="space-y-4">
              {recentPredictions.map((prediction, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        prediction.prediction === 'High' ? 'bg-green-100' :
                        prediction.prediction === 'Medium' ? 'bg-yellow-100' : 'bg-red-100'
                      }`}>
                        <span 
                          className="text-lg"
                        >
                          {prediction.prediction === 'High' ? '🎉' : 
                           prediction.prediction === 'Medium' ? '📈' : '📉'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 flex items-center">
                          <span className={`performance-${prediction.prediction.toLowerCase()} text-sm px-3 py-1`}>
                            {prediction.prediction} Performance
                          </span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Target className="h-3 w-3 mr-1" />
                          Confidence: {(prediction.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {formatDate(prediction.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-lg font-medium mb-2">No predictions yet</p>
              <Link to="/predict" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                Make your first prediction
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-8">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg mr-3">
            <Settings className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/predict"
            className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-xl transition-shadow mr-4">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800 group-hover:text-blue-800 text-lg">New Prediction</p>
                <p className="text-gray-600 mt-1">Predict student performance</p>
              </div>
            </div>
          </Link>
          
          <Link
            to="/profile"
            className="group p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-emerald-500 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-green-50 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            <div className="flex items-center">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 group-hover:shadow-xl transition-shadow mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-800 group-hover:text-emerald-800 text-lg">Profile Settings</p>
                <p className="text-gray-600 mt-1">Manage your account</p>
              </div>
            </div>
          </Link>
          
          <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 opacity-75 cursor-not-allowed">
            <div className="flex items-center">
              <div className="p-4 rounded-2xl bg-gray-400 mr-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-gray-600 text-lg">Advanced Analytics</p>
                <p className="text-gray-500 mt-1">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;