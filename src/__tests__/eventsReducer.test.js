import eventsReducer, { createEvent, updateEvent, deleteEvent } from '../redux/events/eventsSlice'; 

describe('events reducer', () => {
  it('should handle initial state', () => {
    expect(eventsReducer(undefined, {})).toEqual([]);
  });

  it('should handle createEvent', () => {
    const initialState = [];
    const event = {
      eventName: 'Birthday Party',
      eventTime: '18:00',
      eventDate: '2023-06-27',
    };
  
    const newState = eventsReducer(initialState, createEvent(event));
  
    // Check that the new state is an array of length 1
    expect(newState.length).toEqual(1);
  
    // Check that the new state contains an event with the expected properties
    const createdEvent = newState[0];
    expect(createdEvent.eventName).toEqual(event.eventName);
    expect(createdEvent.eventTime).toEqual(event.eventTime);
    expect(createdEvent.eventDate).toEqual(event.eventDate);
  
    // Check that the created event has an id and it's a string
    expect(typeof createdEvent.id).toBe('string');
    expect(createdEvent.id.length).toBeGreaterThan(0);
  });

  it('should handle updateEvent', () => {
    const initialState = [
      {
        id: '1',
        eventName: 'Birthday Party',
        eventTime: '18:00',
        eventDate: '2023-06-27',
      },
    ];
    const updatedEvent = {
      id: '1',
      eventName: 'Dinner Party',
      eventTime: '20:00',
      eventDate: '2023-06-27',
    };

    expect(eventsReducer(initialState, updateEvent(updatedEvent))).toEqual([updatedEvent]);
  });

  it('should handle deleteEvent', () => {
    const initialState = [
      {
        id: '1',
        eventName: 'Birthday Party',
        eventTime: '18:00',
        eventDate: '2023-06-27',
      },
    ];

    expect(eventsReducer(initialState, deleteEvent('1'))).toEqual([]);
  });
});
