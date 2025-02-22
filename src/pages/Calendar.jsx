// src/pages/Calendar.jsx
import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import './Calendar.css';

export default function Calendar() {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '12:00'
    });

    // Load events from localStorage when the component mounts or the user changes.
    useEffect(() => {
        if (user) {
            const storedEvents = localStorage.getItem(`events_${user.username}`);
            if (storedEvents) {
                try {
                    setEvents(JSON.parse(storedEvents));
                } catch (error) {
                    console.error("Error parsing events from localStorage:", error);
                    // Handle the error (e.g., clear corrupted data, show a message)
                    localStorage.removeItem(`events_${user.username}`); // Clear corrupted data
                    setEvents([]); // Reset to an empty array
                }
            } else {
                setEvents([]); // Initialize to an empty array if no data found.
            }
        } else {
            setEvents([]); // Clear events if no user is logged in
        }
    }, [user]); // Dependency on user

    // Save events to localStorage whenever the 'events' state changes or user changes.
    useEffect(() => {
        if (user) {
            localStorage.setItem(`events_${user.username}`, JSON.stringify(events));
        }
    }, [events, user]); // Dependencies: events and user


    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const addEvent = () => {
        if (!newEvent.title) return;

        const event = {
            id: Date.now(),
            ...newEvent,
            userId: user.username, // Associate event with the user
        };

        setEvents([...events, event]);
        setNewEvent({
            title: '',
            description: '',
            date: format(new Date(), 'yyyy-MM-dd'),
            time: '12:00'
        });
        setShowEventForm(false);
    };

    const deleteEvent = (eventId) => {
        setEvents(events.filter(event => event.id !== eventId));
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={previousMonth} className="month-nav-button">
                    <FaChevronLeft />
                </button>
                <h2>{format(currentDate, 'MMMM yyyy')}</h2>
                <button onClick={nextMonth} className="month-nav-button">
                    <FaChevronRight />
                </button>
            </div>

            <button
                className="add-event-button"
                onClick={() => setShowEventForm(true)}
            >
                <FaPlus /> Add Event
            </button>

            {showEventForm && (
                <div className="event-form">
                    <input
                        type="text"
                        placeholder="Event title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        className="event-input"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        className="event-input"
                    />
                    <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="event-input"
                    />
                    <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="event-input"
                    />
                    <div className="event-form-actions">
                        <button onClick={addEvent} className="event-button">Add Event</button>
                        <button onClick={() => setShowEventForm(false)} className="event-button cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="calendar-grid">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="calendar-day-header">{day}</div>
                ))}

                {monthDays.map(day => {
                    // Filter events to show only those belonging to the current user AND the current day.
                    const dayEvents = events.filter(event => event.date === format(day, 'yyyy-MM-dd') && event.userId === user.username);

                    return (
                        <div
                            key={day.toString()}
                            className={`calendar-day ${!isSameMonth(day, currentDate) ? 'other-month' : ''
                                } ${isToday(day) ? 'today' : ''}`}
                        >
                            <span className="day-number">{format(day, 'd')}</span>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <div key={event.id} className="calendar-event">
                                        <span className="event-time">{event.time}</span>
                                        <span className="event-title">{event.title}</span>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="delete-event"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}