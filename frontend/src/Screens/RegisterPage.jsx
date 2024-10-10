import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useGoogleLogin } from '@react-oauth/google';
import Navbar from '../Components/Navbar';

const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch,
    } = useForm();

    // Google auth Logic
    const login = useGoogleLogin({
        onSuccess: tokenResponse => console.log(tokenResponse),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    // Function to check if the age is 18 or above
    const isAdult = (dob) => {
        const dobDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();
        const monthDifference = today.getMonth() - dobDate.getMonth();

        // If birth date hasn't occurred this year yet, subtract 1 from age
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dobDate.getDate())) {
            return age - 1 >= 18;
        }

        return age >= 18;
    };

    // Function to send form data to the backend
    async function onSubmit(data) {
        try {
            const response = await fetch('http://localhost:3001/api/users/register', { // Change to your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: data.fullName.split(' ')[0], // Assuming firstName is the first part of fullName
                    lastName: data.fullName.split(' ')[1] || '', // Assuming lastName is the second part
                    streetAddress: data.streetAddress,
                    town: data.city,
                    state: data.state,
                    pincode: data.pincode,
                    phone: data.phoneNumber,
                    email: data.email,
                    nomineeName: data.nomineeName,
                    sponsorId: data.sponsorID,
                    vigilanceOfficer: 'Officer Name', // You can update this field as per the form data
                    accountUsername: data.username,
                    password: data.password, // In production, ensure you're using secure methods (hashing) to handle passwords
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('User registered successfully:', result);
                // Navigate to home or success page
                navigate('/home');
            } else {
                console.error('Failed to register user:', response.status);
                // Handle the error response (e.g., show an error message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-2xl shadow-lg w-[70%] m-10">
                    <h2 className="text-3xl font-bold mb-6 text-center">Registration Form</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Full Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                {...register('fullName', { required: 'Full Name is required' })}
                                placeholder='Enter Full Name'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">Date of Birth
                                <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="date"
                                {...register('dob', {
                                    required: 'Date of Birth is required',
                                    validate: (value) => isAdult(value) || 'You must be at least 18 years old',
                                })}
                                placeholder='Enter Age'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Phone Number<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('phoneNumber', {
                                    required: 'Phone Number is required',
                                    pattern: {
                                        value: /^[6-9]\d{9}$/,
                                        message: 'Phone Number must be 10 digits',
                                    },
                                })}
                                placeholder='Enter Phone Number'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Email<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="email"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: 'Invalid email format',
                                    },
                                })}
                                placeholder='Enter Email'
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                                autoComplete='email'
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                        </div>

                        {/* Street Address */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Street Address<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('streetAddress', { required: 'Street Address is required' })}
                                placeholder="Enter House Number and Street Name"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.streetAddress && <p className="text-red-500">{errors.streetAddress.message}</p>}
                        </div>

                        {/* Town / City */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Town / City<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('city', { required: 'Town/City is required' })}
                                placeholder="Enter Town / City"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.city && <p className="text-red-500">{errors.city.message}</p>}
                        </div>

                        {/* State Dropdown */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                State<span className='text-red-500'>*</span>
                            </label>
                            <select
                                {...register('state', { required: 'State is required' })}
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            >
                                {/* Options for state */}
                                <option value="">Select State</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Maharashtra">Maharashtra</option>
                                {/* Add more state options as needed */}
                            </select>
                            {errors.state && <p className="text-red-500">{errors.state.message}</p>}
                        </div>

                        {/* Pincode */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Pincode<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('pincode', {
                                    required: 'Pincode is required',
                                    pattern: {
                                        value: /^[1-9][0-9]{5}$/,
                                        message: 'Invalid Pincode',
                                    },
                                })}
                                placeholder="Enter Pincode"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.pincode && <p className="text-red-500">{errors.pincode.message}</p>}
                        </div>

                        {/* Nominee Name */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Nominee Name<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('nomineeName', { required: 'Nominee Name is required' })}
                                placeholder="Enter Nominee Name"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.nomineeName && <p className="text-red-500">{errors.nomineeName.message}</p>}
                        </div>

                        {/* Sponsor ID */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Sponsor ID<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('sponsorID', { required: 'Sponsor ID is required' })}
                                placeholder="Enter Sponsor ID"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.sponsorID && <p className="text-red-500">{errors.sponsorID.message}</p>}
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Username<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                placeholder="Enter Username"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            {errors.username && <p className="text-red-500">{errors.username.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Password<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                                placeholder="Enter Password"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2 cursor-pointer">
                                {showPassword ? 'Hide' : 'Show'}
                            </span>
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-1 font-semibold text-start">
                                Confirm Password<span className='text-red-500'>*</span>
                            </label>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword', {
                                    required: 'Confirm Password is required',
                                    validate: (value) => value === watch('password') || 'Passwords do not match',
                                })}
                                placeholder="Confirm Password"
                                className="w-full border border-gray-300 p-2 focus:outline-none focus:border-black"
                            />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2 cursor-pointer">
                                {showConfirmPassword ? 'Hide' : 'Show'}
                            </span>
                            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="flex space-x-4 justify-center">
                            <button
                                type="submit"
                                className="bg-blue-500 w-32 rounded text-white p-2 hover:bg-blue-600"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Submitting" : "Submit"}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="bg-gray-500 w-32 rounded text-white p-2 hover:bg-gray-600"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <hr />
            <button onClick={() => login()}>Sign in with Google 🚀</button>
        </>
    );
};

export default RegisterPage;