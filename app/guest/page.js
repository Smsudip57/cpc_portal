'use client'
import React,{ useState, useContext} from 'react'
import Navbar from '@/components/navbar'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { MyContext } from '@/context/context';

export default function page() {
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    roll: '',
    department: '',
  });
  const router = useRouter();

  const context = useContext(MyContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      // Send the payment data to your backend API to handle payment
      const response = await axios.post('/api/user/convertToUser', formData, { withCredentials: true });
  
      context.customToast(response.data);
      if (response.data.success && response.data.paymentUrl) {
        router.push(response.data.paymentUrl);
      } else {
        console.error('Error:', response.data.message || 'Payment URL not returned.');
      }
    } catch (err) {
      console.error('Payment failed:', err.message || err);
      context.customToast(err.response.data);
    }
  };
  

  // Handle Logout button click
  const handleLogout = async () => {
    try {
      const res  = await axios.get('/api/user/logout', {}, { withCredentials: true });
      context.customToast(res.data);
      if (res.data.success) {
        router.push('/login');
      }
    } catch (error) {
      context.customToast({success:false, message:'Something went wrong'});
    }
  };





  return (
    <div className='min-w-screen bg-[#BDE9C9] min-h-screen flex items-center justify-center'>
        <Navbar />
        <div className="min-w-[600px] text-center text-black flex flex-col justify-center items-center bg-green-400 p-5 rounded-md gap-5">
      <h2 className="text-center text-2xl font-semibold mb-6">Student Information</h2>

      <form className="space-y-4 text-sm" onSubmit={handlePayment}>
        <div>
          <input
            placeholder='Name'
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-[350px] py-1 px-2 rounded-sm"
            required
          />
        </div>

        <div>
          
          <input
            type="text"
            id="batch"
            name="batch"
            placeholder='Batch e~D-86/E-105'
            value={formData.batch}
            onChange={handleChange}
            className="w-[350px] py-1 px-2 rounded-sm"
            required
          />
        </div>

        <div>
          
          <input
            type="text"
            id="roll"
            name="roll"
            placeholder='Roll'
            value={formData.roll}
            onChange={handleChange}
            className="w-[350px] py-1 px-2 rounded-sm"
            required
          />
        </div>

        <div>

          <input
            type="text"
            id="department"
            name="department"
            placeholder='Department'
            value={formData.department}
            onChange={handleChange}
            className="w-[350px] py-1 px-2 rounded-sm"
            required
          />
        </div>

        <div className="flex justify-between pt-4 pb-8">
          <button
            type="button"
            onClick={handleLogout}
            className="bg-red-600 text-sm py-1 px-3 w-max text-white rounded-md mt-"
          >
            Logout
          </button>
          <button
            type="submit"
            onClick={handlePayment}
            className="bg-blue-700 text-sm py-1 px-3 w-max text-white rounded-md mt-"
          >
            Payment
          </button>
        </div>
      </form>
    </div>
    </div>
  )
}
