import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

export interface Qualification {
    id: number,
    qual_name: string
}

export interface Designation {
    id: number,
    desig_name: string
}

export const RegisterationStep2: React.FC = () => {

    const { id } = useParams<{ id: string }>();

    const [qualification, setQuailfication] = useState<Qualification[]>([])
    const [designation, setDesignation] = useState<Designation[]>([]);

    const [fields, setFields] = useState({
        qualification_id: '',
        specialization: '',
        current_organization: '',
        current_designation_id: '',
        current_from_year: '',
        current_to_year: '',
        current_job_profile: '',
        past_organization: '',
        past_designation_id: '1',
        past_from_year: '',
        past_to_year: '',
        past_job_profile: ''
    })


    const [file, setFile] = useState<File | null>(null)

    const navigate = useNavigate()


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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFields({ ...fields, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleFormSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!file) {
            alert('Resume is required to complete the registeration')
        }

        const payload = new FormData();
        if (file) {
            payload.append('resume', file);
        }

        Object.entries(fields).forEach(([key, val]) => {
            payload.append(key, val);
        });

        console.log(`/candidates/register-step2/${id}`)
        try {
            await api.post(`/candidates/register-step2/${id}`, payload, {
                headers: { "Content-Type": 'multipart/form-data' }
            })
            alert('Registration complete! Please check your backend terminal logs to access the email validation confirmation link.');
            navigate('/login');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error occurred while saving your professional profile metrics.');
        }
    }

    return (
        <div className="max-w-3xl mx-auto my-12 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-emerald-700 p-6 text-center text-white">
                <h2 className="text-xl font-bold">Candidate Wizard - Step 2 of 2</h2>
                <p className="text-xs text-emerald-100 mt-1">Provide your structural educational history, professional background metrics, and upload your resume</p>
            </div>

            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">

                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">1. Academic Foundations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Highest Qualification *</label>
                            <select
                                name="qualification_id"
                                value={fields.qualification_id}
                                onChange={(e) => setFields({ ...fields, qualification_id: e.target.value })}
                                required
                                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                                <option value="" disabled>-- Select Qualification --</option>
                                {qualification.map((qual) => (
                                    <option key={qual.id} value={qual.id}>
                                        {qual.qual_name}
                                    </option>
                                ))}
                            </select>

                            {!fields.qualification_id && (
                                <span className="text-slate-400 text-[10px] mt-1 block">Qualification is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization Stream *</label>
                            <input required type="text" name="specialization" value={fields.specialization} onChange={handleChange} placeholder="e.g. Information Technology" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                    </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">2. Present Professional Status</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Current Organization</label>
                            <input type="text" name="current_organization" value={fields.current_organization} onChange={handleChange} placeholder="Current Company name" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Current Designation *</label>
                            <select
                                name="current_designation_id"
                                value={fields.current_designation_id}
                                onChange={(e) => setFields({ ...fields, current_designation_id: e.target.value })}
                                required
                                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                                <option value="" disabled>-- Select Designation --</option>
                                {designation.map((desig) => (
                                    <option key={desig.id} value={desig.id}>
                                        {desig.desig_name}
                                    </option>
                                ))}
                            </select>

                            {!fields.current_designation_id && (
                                <span className="text-slate-400 text-[10px] mt-1 block">Designation is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">From Year</label>
                            <input type="text" name="current_from_year" value={fields.current_from_year} onChange={handleChange} placeholder="e.g. 2024" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">To Year</label>
                            <input type="text" name="current_to_year" value={fields.current_to_year} onChange={handleChange} placeholder="e.g. Present" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Current Job Profile Summary</label>
                        <textarea name="current_job_profile" value={fields.current_job_profile} onChange={handleChange} placeholder="Describe your core architecture duties and engineering routines..." className="w-full border border-slate-300 rounded p-2 h-20 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                </div>

                <hr className="border-slate-100" />

                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">3. Historical Professional Background</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Past Organization</label>
                            <input type="text" name="past_organization" value={fields.past_organization} onChange={handleChange} placeholder="Previous Company name" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Past Designation *</label>
                            <select
                                name="past_designation_id"
                                value={fields.past_designation_id}
                                onChange={(e) => setFields({ ...fields, past_designation_id: e.target.value })}
                                required
                                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer"
                            >
                                <option value="" disabled>-- Select Designation --</option>
                                {designation.map((desig) => (
                                    <option key={desig.id} value={desig.id}>
                                        {desig.desig_name}
                                    </option>
                                ))}
                            </select>

                            {!fields.past_designation_id && (
                                <span className="text-slate-400 text-[10px] mt-1 block">Designation is required</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">From Year</label>
                            <input type="text" name="past_from_year" value={fields.past_from_year} onChange={handleChange} placeholder="e.g. 2022" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">To Year</label>
                            <input type="text" name="past_to_year" value={fields.past_to_year} onChange={handleChange} placeholder="e.g. 2024" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Past Job Profile Summary</label>
                        <textarea name="past_job_profile" value={fields.past_job_profile} onChange={handleChange} placeholder="Describe responsibilities and technology scopes managed..." className="w-full border border-slate-300 rounded p-2 h-20 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
                    </div>
                </div>

                <hr className="border-slate-100" />

                <div className="p-5 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 text-center">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Resume File Attachment *</label>
                    <input required type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="mx-auto block text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 file:cursor-pointer hover:file:bg-emerald-100" />
                    <p className="text-slate-400 text-xs mt-1.5">Supported formats: PDF, DOC, DOCX (Max size: 5MB)</p>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-lg transition-all shadow-sm cursor-pointer text-center">
                    Complete Registration & Finish Setup
                </button>
            </form>
        </div>
    );
}