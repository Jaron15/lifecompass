import React, { useState } from 'react';

function ImageSelector({ onSelect, onClose, onNameChange }) {
    const imagesCount = 5;
    const [name, setName] = useState(''); // state for the new name

    const handleNameChange = () => {
        onNameChange(name);
        setName(''); // reset the name input after change
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black opacity-50"
                onClick={onClose}  // Allow user to click outside to close
            ></div>

            {/* Modal */}
            <div className="lg:ml-72.5 bg-white w-3/4 max-w-lg p-6 rounded-lg shadow-lg relative z-10">
                <h2 className="text-2xl font-semibold mb-4 text-center">Profile Settings</h2>
                
                {/* Name Change Section */}
                <div className="flex flex-col space-y-4 mb-6">
                    <label htmlFor="name" className="font-medium text-gray-600">Display Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="border rounded-md p-2"
                    />
                    <button 
                        onClick={handleNameChange} 
                        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
                    >
                        Change Name
                    </button>
                </div>

                <h2 className="text-xl font-semibold mb-4 text-center">Change Profile Picture</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                    {Array.from({ length: imagesCount }).map((_, index) => (
                        <div 
                            key={index} 
                            className="border rounded-md cursor-pointer" 
                            onClick={() => onSelect(index + 1)} 
                        >
                            <img 
                                src={`/profilepics/${index + 1}.png`} 
                                alt={`Profile ${index + 1}`} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
                <button 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
                    onClick={onClose}
                >
                    &times;  {/* Close (×) button */}
                </button>
            </div>
        </div>
    );
}

export default ImageSelector;
