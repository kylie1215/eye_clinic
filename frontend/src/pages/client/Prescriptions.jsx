import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
  MagnifyingGlassIcon,
  UserIcon,
  CalendarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { clientAPI } from '../../api';

export default function ClientPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await clientAPI.getPrescriptions();
      const data = response.data.prescriptions || response.data.data || response.data || [];
      setPrescriptions(data);
      setFilteredPrescriptions(data);
    } catch (error) {
      console.error('Prescriptions error:', error);
      toast.error('Failed to load prescriptions');
    }
  };

  useEffect(() => {
    let filtered = prescriptions;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrescriptions(filtered);
  }, [searchTerm, prescriptions]);

  const viewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const handleDownload = (prescription) => {
    toast.success('Prescription downloaded');
    // Implement download functionality
  };

  const handlePrint = (prescription) => {
    toast.success('Printing prescription');
    // Implement print functionality
  };

  const formatValue = (value) => {
    if (value === 0) return 'Plano';
    return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2);
  };

  const stats = [
    { 
      label: 'Total Prescriptions', 
      value: prescriptions.length, 
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      label: 'This Year', 
      value: prescriptions.filter(p => new Date(p.date).getFullYear() === 2024).length, 
      icon: CalendarIcon,
      color: 'from-green-500 to-green-600'
    },
    { 
      label: 'Active', 
      value: prescriptions.filter(p => new Date(p.next_checkup) > new Date()).length, 
      icon: EyeIcon,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      label: 'Doctors', 
      value: new Set(prescriptions.map(p => p.doctor.name)).size, 
      icon: UserIcon,
      color: 'from-cyan-500 to-cyan-600'
    },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 animate-fade-in-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">My Prescriptions</h1>
        <p className="text-gray-600 mt-1">Access your digital prescription records</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl shadow-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mb-6 animate-fade-in-up">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </Card>

      {filteredPrescriptions.length > 0 ? (
        <div className="space-y-4 animate-fade-in-up animate-delay-100">
          {filteredPrescriptions.map((prescription, index) => (
            <Card 
              key={prescription.id} 
              className="animate-slide-in-right hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-gradient-to-br from-[#1ABC9C] to-[#16A085] p-3 rounded-xl">
                      <DocumentTextIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{prescription.diagnosis}</h3>
                      <p className="text-sm text-gray-600">{prescription.doctor.name} - {prescription.doctor.specialization}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Issued: {new Date(prescription.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Right Eye (OD)</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">SPH:</span> <span className="font-medium">{formatValue(prescription.od.sphere)}</span></p>
                        <p><span className="text-gray-600">CYL:</span> <span className="font-medium">{formatValue(prescription.od.cylinder)}</span></p>
                        <p><span className="text-gray-600">AXIS:</span> <span className="font-medium">{prescription.od.axis}°</span></p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-2">Left Eye (OS)</p>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gray-600">SPH:</span> <span className="font-medium">{formatValue(prescription.os.sphere)}</span></p>
                        <p><span className="text-gray-600">CYL:</span> <span className="font-medium">{formatValue(prescription.os.cylinder)}</span></p>
                        <p><span className="text-gray-600">AXIS:</span> <span className="font-medium">{prescription.os.axis}°</span></p>
                      </div>
                    </div>
                  </div>

                  {prescription.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">{prescription.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <Button
                    onClick={() => viewDetails(prescription)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#1ABC9C] to-[#16A085] whitespace-nowrap"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Button>
                  <Button
                    onClick={() => handleDownload(prescription)}
                    variant="outline"
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={() => handlePrint(prescription)}
                    variant="outline"
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <PrinterIcon className="h-4 w-4" />
                    Print
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="animate-fade-in-up">
          <div className="text-center py-12">
            <DocumentTextIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-medium">No prescriptions found</p>
            <p className="text-sm text-gray-500 mt-2">Your prescription records will appear here</p>
          </div>
        </Card>
      )}

      {showDetailsModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Prescription Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedPrescription.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedPrescription.diagnosis}</h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedPrescription.doctor.name} - {selectedPrescription.doctor.specialization}</p>
                    <p className="text-xs text-gray-500 mt-1">Issued: {new Date(selectedPrescription.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Right Eye (OD)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">SPH:</span>
                      <span className="text-xl font-bold text-gray-900">{formatValue(selectedPrescription.od.sphere)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">CYL:</span>
                      <span className="text-xl font-bold text-gray-900">{formatValue(selectedPrescription.od.cylinder)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">AXIS:</span>
                      <span className="text-xl font-bold text-gray-900">{selectedPrescription.od.axis}°</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Left Eye (OS)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">SPH:</span>
                      <span className="text-xl font-bold text-gray-900">{formatValue(selectedPrescription.os.sphere)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">CYL:</span>
                      <span className="text-xl font-bold text-gray-900">{formatValue(selectedPrescription.os.cylinder)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">AXIS:</span>
                      <span className="text-xl font-bold text-gray-900">{selectedPrescription.os.axis}°</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedPrescription.notes && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">{selectedPrescription.notes}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => handleDownload(selectedPrescription)}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => handlePrint(selectedPrescription)}
                  className="flex-1 bg-gradient-to-r from-[#1ABC9C] to-[#16A085]"
                >
                  <PrinterIcon className="h-5 w-5 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
