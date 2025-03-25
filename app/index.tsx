import { Redirect } from 'expo-router';
import { useAuth } from './context/AuthContext';


//Main page: as soon as app is opened, check if user is logged in
export default function Index() {
  //user and loading are taken from the context
  const { user, loading } = useAuth();
  if (loading) return null;
  //if there is a user, firebase will know from the context and redirect to home
  return user ? <Redirect href="/home" /> : <Redirect href="/login" />;
}