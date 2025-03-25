import { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, ViewStyle, ActivityIndicator, Image } from "react-native";
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase';
import { LinearGradient } from 'expo-linear-gradient';

interface Sponsor {
  id: string;
  name: string;
  imageUrl: string;
}

// Define a static mapping object for sponsor logos
const sponsorImages: {[key: string]: any} = {
  'Beats.jpeg': require('../assets/sponsors/Beats.jpeg'),
  'Bivouac.jpeg': require('../assets/sponsors/Bivouac.jpeg'),
  'Chartmetric.jpeg': require('../assets/sponsors/Chartmetric.jpeg'),
  'Cinnaholic.jpeg': require('../assets/sponsors/Cinnaholic.jpeg'),
  'Eargasm.jpeg': require('../assets/sponsors/Eargasm.jpeg'),
  'Happy-Belly.jpeg': require('../assets/sponsors/Happy-Belly.jpeg'),
  'Kind.jpeg': require('../assets/sponsors/Kind.jpeg'),
  'Lesser-Evil.jpeg': require('../assets/sponsors/Lesser-Evil.jpeg'),
  'Maize&Blue.jpeg': require('../assets/sponsors/Maize&Blue.jpeg'),
  'Poppi.jpeg': require('../assets/sponsors/Poppi.jpeg'),
  'Sb-vision.jpeg': require('../assets/sponsors/Sb-vision.jpeg'),
  'SITM.jpeg': require('../assets/sponsors/SITM.jpeg'),
  'Sweetgreen.jpeg': require('../assets/sponsors/Sweetgreen.jpeg'),
  'Third-Man.jpeg': require('../assets/sponsors/Third-Man.jpeg'),
  'Ug-sounds.jpeg': require('../assets/sponsors/Ug-sounds.jpeg'),
  'UTA.jpeg': require('../assets/sponsors/UTA.jpeg'),
  'Wasserman.jpeg': require('../assets/sponsors/Wasserman.jpeg'),
  'ZLI.jpeg': require('../assets/sponsors/ZLI.jpeg'),
  'South-Asian-House.jpeg': require('../assets/sponsors/South-Asian-House.jpeg'),
  'Motivation.jpeg': require('../assets/sponsors/Motivation.jpeg'),
  'Headcount.jpeg': require('../assets/sponsors/Headcount.jpeg'),
  'default-logo.png': require('../assets/images/icon.png'),
};

// Helper function to safely get the logo
const getSponsorImage = (imageUrl: string) => {
  try {
    return sponsorImages[imageUrl];
  } catch (error) {
    console.warn(`Failed to load image: ${imageUrl}`);
    return sponsorImages['default-logo.png'];
  }
};

export default function Sponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const sponsorsRef = collection(db, 'sponsors');
        const snapshot = await getDocs(sponsorsRef);
        const sponsorsList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          imageUrl: doc.data().imageUrl,
        })) as Sponsor[];

        setSponsors(sponsorsList);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSponsors();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1A1A1A' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#000033', '#000066']}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 }}>
            Our Sponsors
          </Text>

          {sponsors.map(sponsor => (
            <View 
              key={sponsor.id}
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
                    source={getSponsorImage(sponsor.imageUrl)}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 18, marginBottom: 4 }}>
                    {sponsor.name}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
} 