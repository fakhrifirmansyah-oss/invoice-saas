import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. Token may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
      {status === 'verifying' && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verifying Email...</h2>
          <p className="text-gray-600">Please wait while we verify your email address.</p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verified!</h2>
          <p className="text-green-600 mb-6">{message}</p>
          <Link to="/login" className="inline-block w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-medium transition-colors">
            Go to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Failed</h2>
          <p className="text-red-600 mb-6">{message}</p>
          <Link to="/register" className="inline-block w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 font-medium transition-colors">
            Back to Register
          </Link>
        </div>
      )}
    </div>
  );
}
