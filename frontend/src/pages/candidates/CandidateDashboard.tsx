import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

export const CandidateDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
    if (user?.id) {
      api.get(`/candidates/${user.id}`)
        .then(res => setProfile(res.data))
        .catch(() => alert('Failed to sync profile information.'));
    }
  }, [user]);

  if (!profile) return <div className="p-12 text-center text-slate-400 font-semibold">Syncing profile record context...</div>;

    return (
        <div className="max-w-4xl mx-auto my-10 p-8 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{profile.full_name}</h1>
                    <p className="text-sm text-slate-500">Candidate Management Space</p>
                </div>
                <button onClick={logout} className="bg-red-50 hover:bg-red-100 text-red-600 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                    Log Out
                </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Specifications</h3>
                    <p><strong>Username:</strong> {profile.username}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Total Experience:</strong> {profile.total_experience} Years</p>
                    <p><strong>Key Skills Matrix:</strong> {profile.key_skills}</p>
                </div>

                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Education & Professional Background</h3>
                    <p><strong>Specialization:</strong> {profile.education?.specialization || 'N/A'}</p>
                    <p><strong>Current Organization:</strong> {profile.education?.current_organization || 'None'}</p>
                    {profile.education?.resume_path && (
                        <div className="pt-3">
                            <a href={`http://localhost:3000/${profile.education.resume_path}`} target="_blank" rel="noreferrer" className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-xs font-bold hover:bg-blue-700">
                                View My Uploaded Resume File
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}