import React from 'react';
import { useSelector } from 'react-redux';

function Upcoming() {
  const { events, tasks, hobbies } = useSelector(state => ({
    events: state.events.events,
    tasks: state.tasks.tasks,
    hobbies: state.hobbies.hobbies
  }));

  // Calculate the start and end dates for the upcoming week
  const today = new Date();
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);

  // Filter events, tasks, and hobbies for the week
  const eventsForWeek = events.filter(event => new Date(event.date) >= today && new Date(event.date) <= endOfWeek);
  const tasksForWeek = tasks.filter(task => 
    (task.dueDate && new Date(task.dueDate) >= today && new Date(task.dueDate) <= endOfWeek) || 
    (task.recurringDay)
  );

  // Assuming hobbies have a 'daysOfWeek' array, we'll count the number of unique hobby days in the upcoming week
  const hobbyDays = new Set();
  hobbies.forEach(hobby => hobby.daysOfWeek.forEach(day => hobbyDays.add(day)));
  const uniqueHobbyDaysCount = hobbyDays.size;

  return (
    <div className="upcoming-container">
      <h2>Upcoming</h2>

      <section>
        <h3>Events</h3>
        {eventsForWeek.map(event => (
          <div key={event.id}>
            {event.name} - {event.date}
          </div>
        ))}
      </section>

      <section>
        <h3>Tasks</h3>
        {tasksForWeek.map(task => (
          <div key={task.id}>
            {task.name} - {task.dueDate || "Recurring"}
          </div>
        ))}
      </section>

      <section>
        <h3>Hobbies</h3>
        <p>You have hobbies scheduled for {uniqueHobbyDaysCount} days this week.</p>
      </section>
    </div>
  );
}

export default Upcoming;
