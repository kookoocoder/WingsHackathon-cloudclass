import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './PersonalInfo.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function PersonalInfo() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({ ...user });

    useEffect(() => {
        if (user) {
            setEditedUser({ ...user });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({ ...editedUser, [name]: value });
    };

    const handleSave = () => {
        updateUser(editedUser);
        setIsEditing(false);
    };

    return (
        <div className="personal-info-container">
            {isEditing ? (
                <>
                    <TextField
                        label="Name"
                        name="username"
                        value={editedUser.username || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email Address"
                        name="email"
                        value={editedUser.email || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Phone Number"
                        name="phone"
                        value={editedUser.phone || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date of Birth"
                        name="dateOfBirth"
                        type="date"
                        value={editedUser.dateOfBirth || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                    <Button onClick={() => {
                        setEditedUser({...user});
                        setIsEditing(false);
                    }}>
                        Cancel
                    </Button>
                </>
            ) : (
                <>
                    <div className="info-field">
                        <label>Name:</label>
                        <div className="info-value">{user?.username}</div>
                    </div>
                    <div className="info-field">
                        <label>Email Address:</label>
                        <div className="info-value">{user?.email}</div>
                    </div>
                    <div className="info-field">
                        <label>Phone Number:</label>
                        <div className="info-value">{user?.phone}</div>
                    </div>
                    <div className="info-field">
                        <label>Date of Birth:</label>
                        <div className="info-value">{user?.dateOfBirth}</div>
                    </div>
                    <Button variant="outlined" onClick={() => setIsEditing(true)}>
                        Edit Information
                    </Button>
                </>
            )}
        </div>
    );
}