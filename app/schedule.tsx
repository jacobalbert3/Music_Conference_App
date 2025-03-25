import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, ViewStyle, StyleSheet } from "react-native";
import { collection, getDocs, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from './config/firebase';
import { useAuth } from './context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

//interface = a way to define the structure of an object
interface Event {
  id: string;
  title: string;
  timeBegin: any; // Firestore timestamp
  timeEnd: any;   // Firestore timestamp
  description: string;
  speaker: string;
  location: string;
  isOptedIn: boolean;
  isExpanded: boolean;
}

//format the time to be in the format of HH:MM AM/PM
const formatTime = (time: any) => {
  if (!time) return '';
  if (time.seconds) {
    const date = new Date(time.seconds * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return time;
};

//schedule component setup
export default function Schedule() {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventsAndPreferences = async () => {
      try {
        // Fetch all events from the firestore collection
        const eventsSnapshot = await getDocs(collection(db, 'events'));

        //convert the snapshot to an array of events
        const eventData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isOptedIn: false,
          isExpanded: false
        })) as Event[];

        // If user is logged in, fetch their preferences
        if (user) {
          //for each event, firebase call is made to fech users preferences for that ervent

          //array of primises: 
          const userPreferencesPromises = eventData.map(event => 
            getDoc(doc(db, 'users', user.uid, 'eventPreferences', event.id))
          );
          const userPreferences = await Promise.all(userPreferencesPromises);
          
          // Merge preferences with events
          eventData.forEach((event, index) => {
            const preference = userPreferences[index].data();
            if (preference) {
              event.isOptedIn = preference.isOptedIn;
            }
          });
        }
        //sort data from time begin
        eventData.sort((a, b) => a.timeBegin - b.timeBegin);
        setEvents(eventData);
      } catch (error) {
        console.error('Error fetching events and preferences:', error);
      }
    };

    fetchEventsAndPreferences();
    //run this function when the user changes
  }, [user]);

  const toggleExpand = (id: string) => {
    //toggle the isExpanded property for the event with the given id
    setEvents(events.map(event => 
      event.id === id ? { ...event, isExpanded: !event.isExpanded } : event
    ));
  };

  const toggleOptIn = async (eventId: string) => {
    if (!user) return;

    try {
      const newOptInStatus = !events.find(e => e.id === eventId)?.isOptedIn;
      
      // Update local state
      setEvents(events.map(event =>
        event.id === eventId 
          ? { ...event, isOptedIn: newOptInStatus } 
          : event
      ));

      // Update Firestore
      await setDoc(
        doc(db, 'users', user.uid, 'eventPreferences', eventId),
        {
          isOptedIn: newOptInStatus,
          updatedAt: serverTimestamp()
        }
      );
    } catch (error) {
      console.error('Error updating preference:', error);
    }
  };

  return (
    <LinearGradient
      colors={['#000033', '#000066']}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 }}>
            Event Schedule
          </Text>
          <Text style={{ fontSize: 16, color: '#FFFFFF80', marginBottom: 20 }}>
            Click event to sign up and see more details.
          </Text>

          {events.map(event => (
            <View 
              key={event.id} 
              style={[
                styles.eventCard,
                { backgroundColor: event.isOptedIn ? '#1B4D3E' : '#4D1B1B' }
              ]}
            >
              <Pressable 
                onPress={() => toggleExpand(event.id)}
                style={styles.eventHeader}
              >
                <Text style={styles.eventTitle}>
                  {event.title}
                </Text>
                <Text style={styles.eventTime}>
                  {formatTime(event.timeBegin)} - {formatTime(event.timeEnd)}
                </Text>
              </Pressable>

              {event.isExpanded && (
                <View style={styles.expandedContent}>
                  <Text style={styles.eventDetail}>
                    {event.description}
                  </Text>
                  <Text style={styles.eventDetail}>
                    Speaker: {event.speaker}
                  </Text>
                  <Text style={styles.eventDetail}>
                    Location: {event.location}
                  </Text>
                  <Pressable
                    onPress={() => toggleOptIn(event.id)}
                    style={styles.optInButton}
                  >
                    <LinearGradient
                      colors={event.isOptedIn ? ['#00BFA5', '#00796B'] : ['#FF4081', '#C51162']}
                      style={styles.optInGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.optInText}>
                        {event.isOptedIn ? 'Opted In' : 'Opt In'}
                      </Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  eventHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    flex: 1,
    fontWeight: '500',
  },
  eventTime: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    marginLeft: 8,
    flexShrink: 0, // Prevents time from wrapping
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  eventDetail: {
    color: '#FFFFFF',
    marginBottom: 12,
    opacity: 0.9,
    lineHeight: 20,
  },
  optInButton: {
    marginTop: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  optInGradient: {
    padding: 12,
    alignItems: 'center',
  },
  optInText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 