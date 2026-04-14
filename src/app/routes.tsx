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
import { PaymentGatewayScreen } from './screens/PaymentGatewayScreen';
import { MyTripsScreen } from './screens/MyTripsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TripDetailScreen } from './screens/TripDetailScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SignInScreen } from './screens/SignInScreen';
import { OnboardingWelcomeScreen } from './screens/OnboardingWelcomeScreen';
import { OnboardingTourScreen } from './screens/OnboardingTourScreen';
import { OnboardingNameScreen } from './screens/OnboardingNameScreen';
import { OnboardingContactScreen } from './screens/OnboardingContactScreen';
import { OnboardingLocationScreen } from './screens/OnboardingLocationScreen';
import { OnboardingPrefsFlightScreen } from './screens/OnboardingPrefsFlightScreen';
import { OnboardingPrefsHotelScreen } from './screens/OnboardingPrefsHotelScreen';
import { OnboardingPermissionsScreen } from './screens/OnboardingPermissionsScreen';
import { OnboardingAllSetScreen } from './screens/OnboardingAllSetScreen';

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
          { path: 'payment', Component: PaymentGatewayScreen },
          { path: 'confirmed', Component: TripConfirmedScreen },
          { path: 'trips', Component: MyTripsScreen },
          { path: 'trips/:id', Component: TripDetailScreen },
          { path: 'settings', Component: SettingsScreen },
          { path: 'notifications', Component: NotificationsScreen },
          { path: 'profile', Component: ProfileScreen },

          // Onboarding flow — Nova-led, protected (user must be signed in)
          // welcome → tour → name → contact → location → prefs-flight → prefs-hotel → permissions → all-set
          { path: 'onboarding',              Component: OnboardingWelcomeScreen    },
          { path: 'onboarding/tour',         Component: OnboardingTourScreen       },
          { path: 'onboarding/name',         Component: OnboardingNameScreen       },
          { path: 'onboarding/contact',      Component: OnboardingContactScreen    },
          { path: 'onboarding/location',     Component: OnboardingLocationScreen   },
          { path: 'onboarding/prefs-flight', Component: OnboardingPrefsFlightScreen},
          { path: 'onboarding/prefs-hotel',  Component: OnboardingPrefsHotelScreen },
          { path: 'onboarding/permissions',  Component: OnboardingPermissionsScreen},
          { path: 'onboarding/all-set',      Component: OnboardingAllSetScreen     },
        ],
      },
    ],
  },
]);
