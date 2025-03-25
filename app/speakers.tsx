import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, ViewStyle, Image, ActivityIndicator } from "react-native";
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';
import { LinearGradient } from 'expo-linear-gradient';

//defines the structure of the speaker object
interface Speaker {
  id: string; 
  name: string;
  bio: string;
  imageUrl: string;  // This will just be the filename from Firebase
  isExpanded: boolean;
}

//defines the type of the speaker image map
type SpeakerImageMap = {
  [key: string]: any;
};

// Define a static mapping object that's created at build time
const speakerImages: SpeakerImageMap = {
  'matt-young.jpg': require('../assets/speakers/matt-young.jpg'),
  'Gene-Salomon.jpeg': require('../assets/speakers/Gene-Salomon.jpeg'),
  'Ron-Laffitte.jpeg': require('../assets/speakers/Ron-Laffitte.jpeg'),
  'Jeremy-Zimmer.jpeg': require('../assets/speakers/Jeremy-Zimmer.jpeg'),
  'Isaac-Slade.jpeg': require('../assets/speakers/Isaac-Slade.jpeg'),
  'Dennis-Denehy.jpeg': require('../assets/speakers/Dennis-Denehy.jpeg'),
  'Cindy-Levitt.jpeg': require('../assets/speakers/Cindy-Levitt.jpeg'),
  'Bill-Werde.jpeg': require('../assets/speakers/Bill-Werde.jpeg'),
  'Ari-Nisman.jpeg': require('../assets/speakers/Ari-Nisman.jpeg'),
  'Silvio-Pietroluongo.jpeg': require('../assets/speakers/Silvio-Pietroluongo.jpeg'),
  'Steve-Bartels.jpeg': require('../assets/speakers/Steve-Bartels.jpeg'),
  'Jackie-Nalpant.jpeg': require('../assets/speakers/Jackie-Nalpant.jpeg'),
  'Gregg-Latterman.jpeg': require('../assets/speakers/Gregg-Latterman.jpeg'),
  'Denise-Melanson.jpeg': require('../assets/speakers/Denise-Melanson.jpeg'),
  'Andrea-Johnson.jpeg': require('../assets/speakers/Andrea-Johnson.jpeg'),
  'Shannon-Casey.jpeg': require('../assets/speakers/Shannon-Casey.jpeg'),
  'default-avatar.jpg': require('../assets/images/splash-icon.png'),
};

// Helper function to safely get the image
const getSpeakerImage = (imageUrl: string) => {
  // If the imageUrl exists in our dictionary, return that image
  if (speakerImages[imageUrl]) {
    return speakerImages[imageUrl];
  }
  
  // If we get here, the image wasn't in our dictionary, so return default
  return speakerImages['default-avatar.jpg'];
};

//speaker component setup
export default function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch speakers from Firestore
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const speakersRef = collection(db, 'speakers');
        //get all docs from the speakers collection
        const snapshot = await getDocs(speakersRef);
        
        //convert the snapshot to an array of speakers
        const speakersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isExpanded: false
        })) as Speaker[];
        //sort the speakers alphabetically by name
        speakersList.sort((a, b) => a.name.localeCompare(b.name));

        setSpeakers(speakersList);
      } catch (error) {
        console.error('Error fetching speakers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpeakers();
  }, []);

  const toggleExpand = (id: string) => {
    setSpeakers(speakers.map(speaker => 
      //flip the isExpanded state for the speaker that was clicked
      speaker.id === id ? { ...speaker, isExpanded: !speaker.isExpanded } : speaker
    ));
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#000033', '#000066']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#FFFF00" />
      </LinearGradient>
    );
  }

  //each speaker is displayed as a card with a name and bio
  return (
    <LinearGradient
      colors={['#000033', '#000066']}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 }}>
            Featured Speakers
          </Text>
          {speakers.map(speaker => (
            <Pressable 
              key={speaker.id} 
              onPress={() => toggleExpand(speaker.id)}
              style={{ 
                backgroundColor: '#2A2A2A',
                borderRadius: 12,
                marginBottom: 16,
                overflow: 'hidden',
              }}
            >
              <View style={{ 
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 80,  
                  height: 80,  
                  borderRadius: 8,
                  backgroundColor: '#2A2A2A',
                  overflow: 'hidden',
                  marginRight: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Image
                    source={getSpeakerImage(speaker.imageUrl)}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 18, marginBottom: 4 }}>
                    {speaker.name}
                  </Text>
                </View>
              </View>

              {speaker.isExpanded && (
                <View style={{ 
                  padding: 16, 
                  backgroundColor: '#3A3A3A',
                  borderTopWidth: 1,
                  borderTopColor: '#444444',
                }}>
                  <Text style={{ 
                    color: '#FFFFFF', 
                    lineHeight: 22,
                  }}>
                    {speaker.bio}
                  </Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
} 