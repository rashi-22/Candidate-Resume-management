// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import type { Designation, Qualification } from "../candidates/RegisterationStep2";

export const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();

    
    const [candidates, setCandidates] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [designationFilter, setDesignationFilter] = useState('');
    const [qualificationFilter, setQualificationFilter] = useState('');

    const [qualification, setQuailfication] = useState<Qualification[]>([])
    const [designation, setDesignation] = useState<Designation[]>([]);

    useEffect(() => {
        Promise.all([
            api.get('/masters/designations'),
            api.get('/masters/qualifications')
        ])
            .then(([designationRes, qualificationRes]) => {
                setDesignation(designationRes.data);
                setQuailfication(qualificationRes.data);
            })
            .catch((err: any) => {
                console.error('Failed to load master filter datasets', err);
            });
    }, []);


    const loadDatabaseRows = async (page: number = 1) => {
        try {
            const res = await api.get('/candidates', {
                params: {
                    page: page,
                    limit: 5,
                    search: searchTerm,
                    designation_id: designationFilter,
                    qualification_id: qualificationFilter
                }
            });

            setCandidates(res.data.data || []);
            setCurrentPage(res.data.meta?.currentPage || 1);
            setTotalPages(res.data.meta?.totalPages || 1);
        } catch (err) {
            console.error('Error fetching data registry profiles mapping.', err);
        }
    };

    
    useEffect(() => {
        loadDatabaseRows(currentPage);
    }, [currentPage]);

    const handleSearchSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadDatabaseRows(1);
    };

    const handleResetFilters = () => {
        setSearchTerm("");
        setDesignationFilter("");
        setQualificationFilter("");
        setCurrentPage(1);
        // Explicitly pass empty strings to bypass state scheduling delay batching
        api.get('/candidates', { params: { page: 1, limit: 2 } }).then((res) => {
            setCandidates(res.data.data || []);
            setCurrentPage(res.data.meta?.currentPage || 1);
            setTotalPages(res.data.meta?.totalPages || 1);
        });
    };

    const triggerProfileDeletion = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this candidate? This will drop their linked education records via CASCADE.')) {
            try {
                await api.delete(`/candidates/${id}`);
                alert('Record removed successfully.');
                loadDatabaseRows(currentPage);
            } catch {
                alert('Failed execution during server delete process pipeline.');
            }
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6 bg-slate-900 text-white p-6 rounded-xl shadow-md">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Admin Candidate Workspace</h1>
                    <p className="text-xs text-slate-400 mt-1">Reviewing active system submissions</p>
                </div>
                <button onClick={logout} className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer">
                    Exit Workspace
                </button>
            </div>

            {/* FILTERS */}
            <form onSubmit={handleSearchSubmit} noValidate className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Search Name / Username</label>
                    <input
                        type="text"
                        placeholder="Search keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Qualification filter</label>
                    <select
                        name="qualificationFilter"
                        value={qualificationFilter}
                        onChange={(e) => setQualificationFilter(e.target.value)}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="" disabled>-- Select Qualification --</option>
                        {qualification.map((qual) => (
                            <option key={qual.id} value={qual.id}>
                                {qual.qual_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Current Designation </label>
                    <select
                        name="designationFilter"
                        value={designationFilter}
                        onChange={(e) => setDesignationFilter(e.target.value)}
                        className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                        <option value="" disabled>-- Select Designation --</option>
                        {designation.map((desig) => (
                            <option key={desig.id} value={desig.id}>
                                {desig.desig_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer text-center">
                        Apply Filters
                    </button>
                    <button type="button" onClick={handleResetFilters} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-3 rounded-lg transition-colors cursor-pointer">
                        Reset
                    </button>
                </div>
            </form>

            {/* Candidates Data */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Candidate Identity</th>
                            <th className="p-4">Contact Fields</th>
                            <th className="p-4 text-center">Experience</th>
                            <th className="p-4">Current Background Entity</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {candidates.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400 text-sm">
                                    No candidate profiles match the chosen evaluation search criteria layers.
                                </td>
                            </tr>
                        ) : (
                            candidates.map((cand) => (
                                <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                                    <td className="p-4 font-bold text-slate-900">{cand.full_name}</td>
                                    <td className="p-4">
                                        <div>{cand.email}</div>
                                        <div className="text-xs text-slate-400">{cand.mobile_number}</div>
                                    </td>
                                    <td className="p-4 text-center font-semibold text-slate-600">{cand.total_experience} Yrs</td>
                                    <td className="p-4 text-xs">
                                        <div className="font-semibold text-slate-800">{cand.education?.current_organization || 'Unemployed'}</div>
                                        <div className="text-slate-400">{cand.education?.specialization || 'No education data linked'}</div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex gap-2 justify-center items-center">
                                            {cand.education?.resume_path && (
                                                <a href={`http://localhost:3000/${cand.education.resume_path}`} target="_blank" rel="noreferrer" className="text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 px-2.5 py-1.5 rounded">
                                                    Open Resume
                                                </a>
                                            )}
                                            <button onClick={() => triggerProfileDeletion(cand.id)} className="text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded cursor-pointer">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-slate-50 border-t border-slate-200 px-4 py-3.5 flex items-center justify-between">
                        <div className="text-xs text-slate-500 font-medium">
                            Showing page <span className="font-bold text-slate-700">{currentPage}</span> of <span className="font-bold text-slate-700">{totalPages}</span>
                        </div>
                        <div className="flex gap-1.5">
                            <button
                                type="button"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                &larr; Previous
                            </button>
                            <button
                                type="button"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-3 py-1.5 text-xs font-semibold rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};