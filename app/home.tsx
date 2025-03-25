//core react native components
import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert, Modal } from 'react-native';
//hook from expo-router for navigation between screens
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from './context/AuthContext';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { signOut, deleteAccount, user } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  //sign out function calls the authcontext 
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await deleteAccount();
              if (!result.success) {
                Alert.alert('Error', result.error || 'Failed to delete account');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          }
        }
      ]
    );
  };

  //navigation handler
  const navigateTo = (route: '/schedule' | '/speakers' | '/sponsors' | '/floor-plan') => {
    router.push(route);
  };

  //reusable componet for buttons in the menu
  const MenuButton = ({ 
    title, //text on the button
    icon, 
    route 
  }: { 
    title: string; 
    icon: keyof typeof Ionicons.glyphMap; 
    route: '/schedule' | '/speakers' | '/sponsors' | '/floor-plan' 
  }) => (
    <Pressable 
      style={styles.menuItem} 
      onPress={() => navigateTo(route)}
    >
      <LinearGradient
        colors={['#FFFF00', '#9933FF']}
        style={styles.menuItemGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={icon} size={32} color="#FFFFFF" />
        <Text style={styles.menuItemText}>{title}</Text>
      </LinearGradient>
    </Pressable>
  );

  const SettingsModal = () => (
    <Modal
      visible={showSettings}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSettings(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Settings</Text>
          <Text style={styles.emailText}>{user?.email}</Text>
          
          <Pressable 
            onPress={handleDeleteAccount}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </Pressable>
          
          <Pressable 
            onPress={() => setShowSettings(false)}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={['#000033', '#000066']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>WELCOME!</Text>
          <Text style={styles.subtitle}>March 2025</Text>
        </View>
        
        <View style={styles.menuGrid}>
          <MenuButton 
            title="Schedule" 
            icon="calendar-outline" 
            route="/schedule" 
          />
          <MenuButton 
            title="Speakers" 
            icon="people-outline" 
            route="/speakers" 
          />
          <MenuButton 
            title="Sponsors" 
            icon="business-outline" 
            route="/sponsors" 
          />
          <MenuButton 
            title="Floor Plan" 
            icon="map-outline" 
            route="/floor-plan" 
          />
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomButtons}>
            <Pressable 
              onPress={() => setShowSettings(true)} 
              style={styles.settingsButton}
            >
              <LinearGradient
                colors={['#9933FF', '#FFFF00']}
                style={styles.settingsGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
            
            <Pressable 
              onPress={handleSignOut} 
              style={[styles.signOutButton, { flex: 1 }]}
            >
              <LinearGradient
                colors={['#9933FF', '#FFFF00']}
                style={styles.signOutGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
      <SettingsModal />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, //flex is used to make the container take up the full height of the screen
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center', //aligns the items in the center of the container
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold', //font weight is used to make the text bold
    color: '#FFFFFF', //color is used to change the color of the text
    textAlign: 'center', //textAlign is used to center the text
    marginTop: 20, //marginTop is used to add margin to the top of the text
  },
  subtitle: {
    fontSize: 24,
    color: '#FFFFFF', //color is used to change the color of the text
    textAlign: 'center', //textAlign is used to center the text
    marginBottom: 40, //marginBottom is used to add margin to the bottom of the text
  },
  menuGrid: {
    flex: 1, //flex is used to make the container take up the full height of the screen
    flexDirection: 'row', //flexDirection is used to make the items in the container go in a row
    flexWrap: 'wrap', //flexWrap is used to wrap the items in the container
    justifyContent: 'center', //justifyContent is used to center the items in the container
    alignItems: 'center', //alignItems is used to center the items in the container
    paddingHorizontal: 20, //paddingHorizontal is used to add padding to the left and right of the container
    gap: 20, //gap is used to add space between the items in the container
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center', //alignItems is used to center the items in the container
  },
  bottomButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
  },
  settingsGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden', //overflow is used to hide the overflow of the items in the container
    elevation: 5, //elevation is used to add a shadow to the items in the container
    shadowColor: '#9933FF', //shadowColor is used to change the color of the shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, //shadowOpacity is used to change the opacity of the shadow
    shadowRadius: 3.84, //shadowRadius is used to change the radius of the shadow
  },
  signOutGradient: {
    flexDirection: 'row', //flexDirection is used to make the items in the container go in a row
    alignItems: 'center', //alignItems is used to center the items in the container
    justifyContent: 'center', //justifyContent is used to center the items in the container
    paddingVertical: 16, //paddingVertical is used to add padding to the top and bottom of the container
    gap: 8, //gap is used to add space between the items in the container
  },
  signOutText: {
    color: '#FFFFFF', //color is used to change the color of the text
    fontSize: 18, //fontSize is used to change the size of the text
    fontWeight: '600', //fontWeight is used to make the text bold
  },
  menuItem: {
    width: '45%', //width is used to change the width of the container
    aspectRatio: 1, //aspectRatio is used to change the aspect ratio of the container
    borderRadius: 16, //borderRadius is used to change the radius of the container
    overflow: 'hidden', //overflow is used to hide the overflow of the items in the container
    elevation: 5, //elevation is used to add a shadow to the items in the container
    shadowColor: '#FFFF00', //shadowColor is used to change the color of the shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, //shadowOpacity is used to change the opacity of the shadow
    shadowRadius: 3.84, //shadowRadius is used to change the radius of the shadow
  },
  menuItemGradient: {
    flex: 1,
    justifyContent: 'center', //justifyContent is used to center the items in the container
    alignItems: 'center', //alignItems is used to center the items in the container
    padding: 20, //padding is used to add padding to the items in the container
    backgroundColor: '#000066', // Added background color
  },
  menuItemText: {
    color: '#FFFFFF', //color is used to change the color of the text
    fontSize: 18, //fontSize is used to change the size of the text
    fontWeight: '600', //fontWeight is used to make the text bold
    marginTop: 12, //marginTop is used to add margin to the top of the text
    textAlign: 'center', //textAlign is used to center the text
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#000066',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  emailText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  closeButtonText: {
    color: '#FFFFFF',
  },
}); 