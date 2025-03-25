//react and state management
import { useState } from 'react';

//react native components
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Alert, 
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';

//custom hook
import { useAuth } from './context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); //toggles between sign in and register

  //get functions from the context: 
  const {signIn, signUp, authLoading } = useAuth();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      //if isLogin and the button is pressed, sign in, otherwise sign up
      const result = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (!result.success) {
        // Always show error alert if success is false
        Alert.alert('Error', result.error || 'An unexpected error occurred');
      }
    } catch (error: any) {
      // Catch any unexpected errors
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    //Component UI: 

    //touchable without feedback: dismisses the keyboard when the user presses outside of the input fields
    //linear gradient: smooth color transitions in the background
    //keyboard avoiding view: prevents the keyboard from covering the input fields
    <LinearGradient 
      colors={['#000033', '#000066']} 
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
        <View style={styles.container}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardView}
          >
            <View style={styles.inner}>
              <Text style={styles.title}>MMBC CONFERENCE</Text>
              <Text style={styles.subtitle}>March 22, 2025</Text>
              
              <View style={styles.tabContainer}>
                <Pressable 
                  style={[styles.tab, isLogin && styles.activeTab]} 
                  onPress={() => setIsLogin(true)}
                >
                  <Text style={[styles.tabText, isLogin && styles.activeTabText]}>SIGN IN</Text>
                </Pressable>
                <Pressable 
                  style={[styles.tab, !isLogin && styles.activeTab]} 
                  onPress={() => setIsLogin(false)}
                >
                  <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>REGISTER</Text>
                </Pressable>
              </View>

              <View style={styles.formContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#FFFFFF80"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!authLoading}
                  returnKeyType="next"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#FFFFFF80"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  editable={!authLoading}
                  returnKeyType="done"
                  onSubmitEditing={handleSubmit}
                />
                
                <Pressable 
                  style={[styles.button, authLoading && styles.buttonDisabled]} 
                  onPress={handleSubmit}
                  disabled={authLoading}
                >
                  {authLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <LinearGradient
                      colors={['#FFFF00', '#9933FF']}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.buttonText}>
                        {isLogin ? 'Sign In' : 'Create Account'}
                      </Text>
                    </LinearGradient>
                  )}
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000066',
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#9933FF',
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    opacity: 0.7,
  },
  activeTabText: {
    color: '#FFFFFF',
    opacity: 1,
  },
  formContainer: {
    backgroundColor: '#000080',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    backgroundColor: '#000066',
    padding: 15,
    borderRadius: 12,
    color: '#FFFFFF',
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#000033',
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000033',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 