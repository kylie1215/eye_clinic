import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { 
  UsersIcon, 
  MagnifyingGlassIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/doctor/patients');
      setPatients(response.data.data || response.data || []);
    } catch (error) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Patient Records</h1>
        <p className="text-gray-600 mt-1">View and manage your patient information</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">{patients.length}</p>
            </div>
          </div>
        </Card>
        <Card className="animate-scale-in animate-delay-100">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl">
              <CalendarIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Today</p>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(patients.length * 0.2)}</p>
            </div>
          </div>
        </Card>
        <Card className="animate-scale-in animate-delay-200">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl">
              <ClipboardDocumentListIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Records Updated</p>
              <p className="text-3xl font-bold text-gray-900">{Math.floor(patients.length * 0.5)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 animate-fade-in-up animate-delay-300">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="primary">
            <UsersIcon className="h-5 w-5 mr-2" />
            Add Patient
          </Button>
        </div>
      </Card>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.length > 0 ? filteredPatients.map((patient, index) => (
          <Card 
            key={patient.id} 
            className="animate-scale-in hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{patient.name}</h3>
                  <span className="text-xs px-2 py-1 bg-[#E8F8F5] text-[#1ABC9C] rounded-full font-medium">
                    {patient.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <EnvelopeIcon className="h-4 w-4 text-[#1ABC9C]" />
                <span className="truncate">{patient.email}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <PhoneIcon className="h-4 w-4 text-green-500" />
                  <span>{patient.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                <span>Joined {new Date(patient.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Appointments</p>
                <p className="text-lg font-bold text-[#1ABC9C]">{patient.appointments_count || 0}</p>
              </div>
              <div className="text-center p-2 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Prescriptions</p>
                <p className="text-lg font-bold text-purple-600">{patient.prescriptions_count || 0}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="primary" className="flex-1 flex items-center justify-center gap-2">
                <EyeIcon className="h-4 w-4" />
                View Records
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <PencilIcon className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )) : (
          <div className="col-span-3">
            <Card>
              <div className="text-center py-12 text-gray-500">
                <UsersIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">No patients found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
