import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BarChart3, ListChecks, PlusCircle } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { DashboardScreen, LoginScreen, RegisterScreen } from '../presentation';
import { AppHeader } from '../presentation/features/layout';
import { NewTransactionScreen, TransactionsScreen } from '../presentation/features/transactions';
import { AppLockScreen } from '../screens/AppLockScreen';
import { NotFoundScreen } from '../screens/NotFoundScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/tokens';
import { MainTabParamList, RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <AppHeader />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          height: 56 + insets.bottom,
          paddingTop: 4,
          paddingBottom: insets.bottom + 4,
          backgroundColor: colors.surface,
          elevation: 8,
          shadowOpacity: 0.12,
        },
        tabBarItemStyle: { flex: 1 },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Resumo') return <BarChart3 color={color} size={size} />;
          if (route.name === 'Transacoes') return <ListChecks color={color} size={size} />;
          return <PlusCircle color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Resumo" component={DashboardScreen} options={{ title: 'Início' }} />
      <Tab.Screen name="Transacoes" component={TransactionsScreen} options={{ title: 'Histórico' }} />
      <Tab.Screen name="NovaTransacao" component={NewTransactionScreen} options={{ title: 'Adicionar' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user, loading, isLocked } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (user && isLocked) {
    return <AppLockScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="NotFound" component={NotFoundScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}