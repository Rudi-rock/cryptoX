import React, { useState } from 'react';
import { Header, Card, Button, Input } from '../components';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic
  };

  return (
    <div>
      <Header 
        title="Profile" 
        subtitle="Manage your personal information" 
      />

      <Card>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Personal Information</h3>
          <Button 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              label="First Name"
              value={profile.firstName}
              onChange={handleChange}
              name="firstName"
            />
            <Input
              label="Last Name"
              value={profile.lastName}
              onChange={handleChange}
              name="lastName"
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              name="email"
            />
            <Input
              label="Phone"
              value={profile.phone}
              onChange={handleChange}
              name="phone"
            />
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">First Name</label>
              <p className="text-gray-900">{profile.firstName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Last Name</label>
              <p className="text-gray-900">{profile.lastName || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Email</label>
              <p className="text-gray-900">{profile.email || 'Not set'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Phone</label>
              <p className="text-gray-900">{profile.phone || 'Not set'}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
