import React, { useEffect, useState } from 'react';
import config from '../constants.js';

const DashboardPage = ({ user, observations, onLogout, onLoadObservations, onCreateObservation }) => {
  const [newObservation, setNewObservation] = useState({ chimpName: '', location: '', behavior: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onLoadObservations();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewObservation(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    setPhotoFile(event.target.files[0]);
  };

  const handleCreateObservation = async (event) => {
    event.preventDefault();
    if (!newObservation.chimpName || !newObservation.location) {
      alert('Chimp Name and Location are required.');
      return;
    }
    setIsSubmitting(true);
    const observationData = { ...newObservation };
    if (photoFile) {
      observationData.photo = photoFile;
    }
    await onCreateObservation(observationData);
    setNewObservation({ chimpName: '', location: '', behavior: '' });
    setPhotoFile(null);
    event.target.reset(); // Reset form fields including file input
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChimpTracker</h1>
            <p className="text-sm text-gray-500">Welcome, {user.name} ({user.role})</p>
          </div>
          <div className="space-x-4">
             <a 
              href={`${config.BACKEND_URL}/admin`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              Admin Panel
            </a>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create New Observation Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Log New Observation</h2>
              <form onSubmit={handleCreateObservation} className="space-y-4">
                <div>
                  <label htmlFor="chimpName" className="block text-sm font-medium text-gray-700">Chimp Name</label>
                  <input type="text" name="chimpName" id="chimpName" value={newObservation.chimpName} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" id="location" value={newObservation.location} onChange={handleInputChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div>
                  <label htmlFor="behavior" className="block text-sm font-medium text-gray-700">Behavior</label>
                  <textarea name="behavior" id="behavior" value={newObservation.behavior} onChange={handleInputChange} rows="4" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div>
                  <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo</label>
                  <input type="file" name="photo" id="photo" onChange={handleFileChange} className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-400">
                  {isSubmitting ? 'Submitting...' : 'Submit Observation'}
                </button>
              </form>
            </div>
          </div>

          {/* Observations List */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-lg shadow overflow-hidden">
               <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800">Recent Observations</h2>
               </div>
                {observations.length === 0 ? (
                  <p className="text-gray-500 px-6 pb-6">No observations yet. Log your first one!</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {observations.map(obs => (
                      <li key={obs.id} className="p-6 hover:bg-gray-50">
                        <div className="flex space-x-4">
                          {obs.photo && (
                            <img src={obs.photo.thumbnail} alt={obs.chimpName} className="w-24 h-24 rounded-md object-cover bg-gray-200 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                               <div>
                                <p className="text-lg font-semibold text-blue-700">{obs.chimpName}</p>
                                <p className="text-sm text-gray-600">in {obs.location}</p>
                               </div>
                               <p className="text-xs text-gray-400">{new Date(obs.observationDate).toLocaleString()}</p>
                            </div>
                            <p className="mt-2 text-sm text-gray-800">{obs.behavior}</p>
                            <p className="mt-2 text-xs text-gray-500">Observer: {obs.observer?.name || 'Unknown'}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
