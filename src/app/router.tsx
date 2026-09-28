import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomePage } from '@/pages/HomePage';
import { RecipesPage } from '@/pages/RecipesPage';
import { RecipeDetailPage } from '@/pages/RecipeDetailPage';
import { AdaptRecipePage } from '@/pages/AdaptRecipePage';
import { CookingPage } from '@/pages/CookingPage';
import { AIPage } from '@/pages/AIPage';
import { GenerateRecipePage } from '@/pages/GenerateRecipePage';
import { CookWithWhatIHavePage } from '@/pages/CookWithWhatIHavePage';
import { SavedPage } from '@/pages/SavedPage';
import { ProfilePage } from '@/pages/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'recipes', element: <RecipesPage /> },
      { path: 'recipes/:id', element: <RecipeDetailPage /> },
      { path: 'recipes/:id/adapt', element: <AdaptRecipePage /> },
      { path: 'recipes/:id/cook', element: <CookingPage /> },
      { path: 'ai', element: <AIPage /> },
      { path: 'generate', element: <GenerateRecipePage /> },
      { path: 'cook-with-what-i-have', element: <CookWithWhatIHavePage /> },
      { path: 'saved', element: <SavedPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
]);
