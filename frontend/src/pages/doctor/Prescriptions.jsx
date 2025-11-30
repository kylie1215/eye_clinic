import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import Loading from '../../components/Loading';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import { 
  ClipboardDocumentCheckIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { doctorAPI } from '../../api';
import toast from 'react-hot-toast';

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    appointment_id: '',
    client_id: '',
    right_sphere: '',
    right_cylinder: '',
    right_axis: '',
    right_add: '',
    left_sphere: '',
    left_cylinder: '',
    left_axis: '',
    left_add: '',
    pd: '',
    notes: '',
    prescription_date: new Date().toISOString().split('T')[0],
    expiry_date: ''
  });

  useEffect(() => {
    fetchPrescriptions();
    fetchAppointments();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await doctorAPI.getPrescriptions();
      setPrescriptions(response.data.data || response.data || []);
    } catch (error) {
      console.error('Prescriptions error:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      const allAppointments = response.data.data || response.data || [];
      // Filter for approved or completed appointments
      const availableAppointments = allAppointments.filter(apt => 
        apt.status === 'approved' || apt.status === 'completed'
      );
      setAppointments(availableAppointments);
    } catch (error) {
      console.error('Appointments error:', error);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const viewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setFormData({
      appointment_id: '',
      client_id: '',
      right_sphere: '',
      right_cylinder: '',
      right_axis: '',
      right_add: '',
      left_sphere: '',
      left_cylinder: '',
      left_axis: '',
      left_add: '',
      pd: '',
      notes: '',
      prescription_date: new Date().toISOString().split('T')[0],
      expiry_date: ''
    });
    setShowCreateModal(true);
  };

  const openEditModal = (prescription) => {
    setIsEditing(true);
    setSelectedPrescription(prescription);
    setFormData({
      appointment_id: prescription.appointment_id,
      client_id: prescription.client_id,
      right_sphere: prescription.right_sphere || '',
      right_cylinder: prescription.right_cylinder || '',
      right_axis: prescription.right_axis || '',
      right_add: prescription.right_add || '',
      left_sphere: prescription.left_sphere || '',
      left_cylinder: prescription.left_cylinder || '',
      left_axis: prescription.left_axis || '',
      left_add: prescription.left_add || '',
      pd: prescription.pd || '',
      notes: prescription.notes || '',
      prescription_date: prescription.prescription_date || new Date().toISOString().split('T')[0],
      expiry_date: prescription.expiry_date || ''
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await doctorAPI.updatePrescription(selectedPrescription.id, formData);
        toast.success('Prescription updated successfully');
      } else {
        await doctorAPI.createPrescription(formData);
        toast.success('Prescription created successfully');
      }
      setShowCreateModal(false);
      fetchPrescriptions();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Operation failed';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;
    
    try {
      await doctorAPI.deletePrescription(id);
      toast.success('Prescription deleted successfully');
      fetchPrescriptions();
    } catch (error) {
      toast.error('Failed to delete prescription');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAppointmentChange = (e) => {
    const appointmentId = e.target.value;
    const appointment = appointments.find(a => a.id === parseInt(appointmentId));
    if (appointment) {
      setFormData(prev => ({
        ...prev,
        appointment_id: appointmentId,
        client_id: appointment.client_id
      }));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 animate-fade-in-down">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2C3E50] to-[#1ABC9C] bg-clip-text text-transparent">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Create and manage patient prescriptions</p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          New Prescription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="animate-scale-in">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <ClipboardDocumentCheckIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
            </div>
          </div>
        </Card>
        <Card className="animate-scale-in animate-delay-50">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{prescriptions.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth()).length}</p>
            </div>
          </div>
        </Card>
        <Card className="animate-scale-in animate-delay-100">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
              <CalendarIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{prescriptions.filter(p => new Date(p.created_at) > new Date(Date.now() - 7*24*60*60*1000)).length}</p>
            </div>
          </div>
        </Card>
        <Card className="animate-scale-in animate-delay-150">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-xl">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Patients</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(prescriptions.map(p => p.client_id)).size}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6 animate-fade-in-up animate-delay-200">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search prescriptions by patient name or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length > 0 ? filteredPrescriptions.map((prescription, index) => (
          <Card 
            key={prescription.id} 
            className="animate-slide-in-right hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4 flex-1">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl">
                  <ClipboardDocumentCheckIcon className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {prescription.client?.name || 'Unknown Patient'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{new Date(prescription.prescription_date || prescription.created_at).toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          {prescription.expiry_date ? 
                            new Date(prescription.expiry_date) > new Date() ? 'Active' : 'Expired'
                            : 'Active'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">PD (Pupillary Distance)</p>
                      <p className="text-sm font-medium text-gray-900">{prescription.pd || 'Not specified'}</p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Right Eye (OD)</p>
                      <p className="text-sm font-medium text-gray-900">
                        SPH: {prescription.right_sphere || 0} CYL: {prescription.right_cylinder || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Left Eye (OS)</p>
                      <p className="text-sm font-medium text-gray-900">
                        SPH: {prescription.left_sphere || 0} CYL: {prescription.left_cylinder || 0}
                      </p>
                    </div>
                  </div>

                  {prescription.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{prescription.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button 
                  onClick={() => viewPrescription(prescription)}
                  className="p-2 text-[#1ABC9C] hover:bg-[#E8F8F5] rounded-lg transition-colors"
                  title="View"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => openEditModal(prescription)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleDelete(prescription.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </Card>
        )) : (
          <Card>
            <div className="text-center py-12 text-gray-500">
              <ClipboardDocumentCheckIcon className="h-16 w-16 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No prescriptions found</p>
              <p className="text-sm mt-1">Create your first prescription to get started</p>
            </div>
          </Card>
        )}
      </div>

      {/* View Prescription Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Prescription Details"
      >
        {selectedPrescription && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <p className="text-sm text-gray-600 mb-1">Patient</p>
              <p className="text-lg font-semibold text-gray-900">{selectedPrescription.client?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-purple-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Right Eye (OD)</p>
                <div className="space-y-1 text-sm">
                  <p>Sphere: {selectedPrescription.right_sphere || 0}</p>
                  <p>Cylinder: {selectedPrescription.right_cylinder || 0}</p>
                  <p>Axis: {selectedPrescription.right_axis || 0}°</p>
                  <p>Add: {selectedPrescription.right_add || 0}</p>
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Left Eye (OS)</p>
                <div className="space-y-1 text-sm">
                  <p>Sphere: {selectedPrescription.left_sphere || 0}</p>
                  <p>Cylinder: {selectedPrescription.left_cylinder || 0}</p>
                  <p>Axis: {selectedPrescription.left_axis || 0}°</p>
                  <p>Add: {selectedPrescription.left_add || 0}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-cyan-50 rounded-xl">
              <p className="text-sm font-medium text-gray-700 mb-2">Pupillary Distance</p>
              <p className="text-lg font-semibold text-gray-900">{selectedPrescription.pd || 'Not specified'}</p>
            </div>
            {selectedPrescription.notes && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
                <p className="text-sm text-gray-600">{selectedPrescription.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create/Edit Prescription Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={isEditing ? "Edit Prescription" : "Create New Prescription"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Appointment <span className="text-red-500">*</span>
            </label>
            <select
              name="appointment_id"
              value={formData.appointment_id}
              onChange={handleAppointmentChange}
              required
              disabled={isEditing}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
            >
              <option value="">Select an appointment...</option>
              {appointments.length === 0 ? (
                <option value="" disabled>No approved appointments available</option>
              ) : (
                appointments.map(appointment => (
                  <option key={appointment.id} value={appointment.id}>
                    {appointment.client?.name || 'Unknown'} - {appointment.appointment_date} at {appointment.start_time} ({appointment.status})
                  </option>
                ))
              )}
            </select>
          </div>

          {formData.client_id && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Patient ID: {formData.client_id}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Right Eye (OD)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sphere"
                name="right_sphere"
                type="number"
                step="0.25"
                value={formData.right_sphere}
                onChange={handleInputChange}
              />
              <Input
                label="Cylinder"
                name="right_cylinder"
                type="number"
                step="0.25"
                value={formData.right_cylinder}
                onChange={handleInputChange}
              />
              <Input
                label="Axis"
                name="right_axis"
                type="number"
                min="0"
                max="180"
                value={formData.right_axis}
                onChange={handleInputChange}
              />
              <Input
                label="Add"
                name="right_add"
                type="number"
                step="0.25"
                value={formData.right_add}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Left Eye (OS)</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sphere"
                name="left_sphere"
                type="number"
                step="0.25"
                value={formData.left_sphere}
                onChange={handleInputChange}
              />
              <Input
                label="Cylinder"
                name="left_cylinder"
                type="number"
                step="0.25"
                value={formData.left_cylinder}
                onChange={handleInputChange}
              />
              <Input
                label="Axis"
                name="left_axis"
                type="number"
                min="0"
                max="180"
                value={formData.left_axis}
                onChange={handleInputChange}
              />
              <Input
                label="Add"
                name="left_add"
                type="number"
                step="0.25"
                value={formData.left_add}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Pupillary Distance (PD)"
                name="pd"
                type="number"
                step="0.5"
                value={formData.pd}
                onChange={handleInputChange}
              />
              <Input
                label="Prescription Date"
                name="prescription_date"
                type="date"
                value={formData.prescription_date}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Expiry Date"
                name="expiry_date"
                type="date"
                value={formData.expiry_date}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1ABC9C] focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? 'Update' : 'Create'} Prescription
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
