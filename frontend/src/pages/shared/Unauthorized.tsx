import React from "react";
import { Link } from "react-router-dom";

export const Unauthorized: React.FC = () => {
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-extrabold text-red-600 mb-2">403 - Restricted Access</h1>
        <p className="text-slate-600 mb-6">You do not have administrative permissions to view this dashboard workspace.</p>
        <Link to="/login" className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-900 transition-colors">
            Return to Login
        </Link>
    </div>
}