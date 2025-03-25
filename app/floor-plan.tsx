import { View, Image, ScrollView, Text, ViewStyle, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function FloorPlan() {
  // Get device width to make image responsive
  const windowWidth = Dimensions.get('window').width;

  return (
    <LinearGradient
      colors={['#000033', '#000066']}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 20 }}>
            Michigan Ross Floor Plan
          </Text>
          
          <View style={{ 
            padding: 16,
            alignItems: 'center',
            width: '100%'
          }}>
            <Image
              source={require('../assets/images/floorplan.png')}
              style={{
                width: windowWidth - 20,
                height: (windowWidth - 20) * 0.9,
                resizeMode: 'contain',
              }}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
} 