// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FileSystemProvider } from './contexts/FileSystemContext'; // Import FileSystemProvider
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainContent from './components/MainContent';
import PersonalInfo from './pages/PersonalInfo';
import TaskList from './pages/TaskList';
import Calendar from './pages/Calendar';
import './App.css';

function Layout({ children }) {
    return (
        <div className="app">
            <Sidebar />
            <Header />
            {children}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <FileSystemProvider>  {/* Wrap the routes with FileSystemProvider */}
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Layout>
                                    <MainContent />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/personal-info" element={
                            <ProtectedRoute>
                                <Layout>
                                    <PersonalInfo />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/tasks" element={
                            <ProtectedRoute>
                                <Layout>
                                    <TaskList />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="/calendar" element={
                            <ProtectedRoute>
                                <Layout>
                                    <Calendar />
                                </Layout>
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
            </FileSystemProvider>
        </AuthProvider>
    );
}

export default App;