import { useState } from 'react';
import './Meeting.css';

export default function Meeting() {
  const [showModal, setShowModal] = useState(false);

  const handleJoinMeeting = () => {
    window.open('https://talk.brave.com/MvBhtEnUrvnvGm-AqKFQ-NNe7c7xXMPyfVpAS3CfuPI', '_blank');
    setShowModal(false); // Close modal after opening the link
  };

  return (
    <div className="meeting-container">
      <h1>Team Meeting</h1>
      <p>Click below to join the Brave Talk meeting:</p>
      <button onClick={() => setShowModal(true)} className="start-meeting-button">
        Start Meeting
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Join the Team Meeting</h2>
            <p>This will open Brave Talk in a new tab. Ready to join?</p>
            <button onClick={handleJoinMeeting} className="join-meeting-button">
              Join Now
            </button>
            <button onClick={() => setShowModal(false)} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}