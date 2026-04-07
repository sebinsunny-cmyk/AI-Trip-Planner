import { createBrowserRouter } from 'react-router';
import { PhoneFrame } from './layouts/PhoneFrame';
import { ProtectedLayout } from './layouts/ProtectedLayout';
import { HomeScreen } from './screens/HomeScreen';
import { TripIntentScreen } from './screens/TripIntentScreen';
import { TripParamsScreen } from './screens/TripParamsScreen';
import { AgentAutoScreen } from './screens/AgentAutoScreen';
import { UnifiedReviewScreen } from './screens/UnifiedReviewScreen';
import { AgentLiveScreen } from './screens/AgentLiveScreen';
import { TripConfirmedScreen } from './screens/TripConfirmedScreen';
import { MyTripsScreen } from './screens/MyTripsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TripDetailScreen } from './screens/TripDetailScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SignInScreen } from './screens/SignInScreen';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PhoneFrame,
    children: [
      // Public route — no auth needed
      { path: 'signin', Component: SignInScreen },

      // Protected routes — redirect to /signin if not signed in
      {
        Component: ProtectedLayout,
        children: [
          { index: true, Component: HomeScreen },
          { path: 'new-trip', Component: TripIntentScreen },
          { path: 'trip-params', Component: TripParamsScreen },
          { path: 'agent-auto', Component: AgentAutoScreen },
          { path: 'unified-review', Component: UnifiedReviewScreen },
          { path: 'agent', Component: AgentLiveScreen },
          { path: 'confirmed', Component: TripConfirmedScreen },
          { path: 'trips', Component: MyTripsScreen },
          { path: 'trips/:id', Component: TripDetailScreen },
          { path: 'settings', Component: SettingsScreen },
          { path: 'notifications', Component: NotificationsScreen },
          { path: 'profile', Component: ProfileScreen },
        ],
      },
    ],
  },
]);
