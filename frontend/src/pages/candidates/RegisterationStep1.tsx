import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";


interface Country {
    id: number,
    country_name: string
}
export const RegisterationStep1: React.FC = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const [countries, setCountries] = useState<Country[]>([])

    const navigate = useNavigate();

    useEffect(() => {
        api.get('/masters/countries')
            .then((res) => {
                console.log("res.data : ", res.data)
                setCountries(res.data)
            })
            .catch((err: any) => {
                console.error('Failed to load countries', err)
            })
    }, [])



    const passwordValue = watch("password");

    const onSubmit = async (data: any) => {
        try {
            const res = await api.post('/candidates/register-step1', {
                ...data,
                country_id: Number(data.country_id)
            })
            navigate(`/register-step2/${res.data.id}`)
        } catch (err: any) {
            alert(err.response?.data?.message || 'Step 1 registration failed.');
        }
    }

    return (
        <div className="max-w-3xl mx-auto my-12 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 p-6 text-center text-white">
                <h2 className="text-xl font-bold">Candidate Wizard - Step 1 of 2</h2>
                <p className="text-xs text-slate-400 mt-1">Provide account credentials and structural background details</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">User Name *</label>
                            <input type='text' {...register('username', { required: "Username is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.username && <span className="text-red-500 text-xs">{String(errors.username.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Email * <span className="text-slate-400 font-normal">(Your Email ID)</span></label>
                            <input type="email" {...register('email', { required: "Email is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.email && <span className="text-red-500 text-xs">{String(errors.email.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Password *</label>
                            <input type="password" {...register('password', { required: "Password is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.password && <span className="text-red-500 text-xs">{String(errors.password.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm Password *</label>
                            <input type="password" {...register('confirm_password', {
                                required: "Please confirm your password",
                                validate: value => value === passwordValue || "Passwords do not match"
                            })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.confirm_password && <span className="text-red-500 text-xs">{String(errors.confirm_password.message)}</span>}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="bg-slate-100 px-4 py-2 rounded text-sm font-bold text-slate-700 tracking-wide mb-4">
                        Contact Information
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Title *</label>
                            <select {...register('title', { required: "Title is required" })} defaultValue="" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                                <option value="" disabled>-- Select Title --</option>
                                <option value="Mr.">Mr.</option>
                                <option value="Ms.">Ms.</option>
                                <option value="Mrs.">Mrs.</option>
                                <option value="Dr.">Dr.</option>
                            </select>
                            {errors.title && <span className="text-red-500 text-xs">{String(errors.title.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name *</label>
                            <input type="text" {...register('full_name', { required: "Full name is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.full_name && <span className="text-red-500 text-xs">{String(errors.full_name.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth *</label>
                            <input type="date" {...register('dob', { required: "Date of Birth is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.dob && <span className="text-red-500 text-xs">{String(errors.dob.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Country *</label>
                            <select {...register('country_id', { required: "Country selection is required" })} defaultValue="" className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer">
                                <option value="" disabled>-- Select Country --</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id}>
                                        {country.country_name}
                                    </option>
                                ))}
                            </select>
                            {errors.country_id && <span className="text-red-500 text-xs">{String(errors.country_id.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">State/County *</label>
                            <input type="text" {...register('state_county', { required: "State/County is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.state_county && <span className="text-red-500 text-xs">{String(errors.state_county.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Town/City</label>
                            <input type="text" {...register('town_city')} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                            <input type="text"
                                placeholder="e.g. 9999999999"
                                {...register('phone_number',
                                    {
                                        maxLength: { value: 10, message: "Cannot exceed 10 digits" },
                                        minLength: {value: 10, message: "Cannot exceed 10 digits"},
                                        pattern: { value: /^[0-86-9]+$/, message: "Only numbers are allowed" }
                                    }
                                )}
                                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.phone_number && <span className="text-red-500 text-xs">{String(errors.phone_number.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile Number *</label>
                            <input type="text"
                                placeholder="e.g. 9999999999"
                                {...register('mobile_number',
                                    {
                                        required: "Mobile number is required",
                                        maxLength: { value: 10, message: "Cannot exceed 10 digits" },
                                        minLength: {value: 10, message: "Cannot exceed 10 digits"},
                                        pattern: { value: /^[0-86-9]+$/, message: "Only numbers are allowed" }
                                    }
                                )}
                                className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.mobile_number && <span className="text-red-500 text-xs">{String(errors.mobile_number.message)}</span>}
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="bg-slate-100 px-4 py-2 rounded text-sm font-bold text-slate-700 tracking-wide mb-4">
                        Brief Synopsis of Your Resume
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Total Experience (Years) *</label>
                            <input type="number" step="any" placeholder="Your Exp." {...register('total_experience', { required: "Experience tier is required" })} className="w-full border border-slate-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                            {errors.total_experience && <span className="text-red-500 text-xs">{String(errors.total_experience.message)}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Key Skills *</label>
                            <textarea placeholder="e.g. React, Node.js, TypeScript" {...register('key_skills', { required: "Core skills matrix is required" })} className="w-full border border-slate-300 rounded p-2 h-24 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none" />
                            {errors.key_skills && <span className="text-red-500 text-xs">{String(errors.key_skills.message)}</span>}
                        </div>
                    </div>
                </div>

                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg transition-all shadow-sm cursor-pointer text-center">
                    Next &rarr;
                </button>
            </form>
        </div>
    );
}