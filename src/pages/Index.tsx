
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useClothes } from '../hooks/useClothes';
import Header from '../components/Header';
import NavigationTabs from '../components/NavigationTabs';
import ErrorDisplay from '../components/ErrorDisplay';
import MainContent from '../components/MainContent';
import LoadingScreen from '../components/LoadingScreen';
import CaptureModal from '../components/CaptureModal';

const Index = () => {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'planner' | 'occasions'>('wardrobe');
  const [showCapture, setShowCapture] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    season: '',
    occasion: ''
  });

  const { user, signOut } = useAuth();
  const { clothes, loading, error, deleteClothingItem } = useClothes();

  console.log('Index: Clothes from useClothes hook:', clothes);

  // Convert to legacy format for existing components
  const legacyClothes = clothes.map(item => ({
    id: item.id,
    name: item.name || 'Untitled Item',
    category: item.category,
    color: item.color,
    season: 'all' as const,
    occasion: item.occasion,
    imageUrl: item.image_url,
    dateAdded: item.created_at,
    material: undefined
  }));

  console.log('Index: Legacy format clothes:', legacyClothes);

  const filteredLegacyItems = legacyClothes.filter(item => {
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.color || item.color.toLowerCase().includes(filters.color.toLowerCase())) &&
      (!filters.occasion || item.occasion === filters.occasion)
    );
  });

  const handleDeleteItem = async (id: string) => {
    try {
      console.log('Index: Attempting to delete item:', id);
      await deleteClothingItem(id);
      console.log('Index: Successfully deleted item:', id);
    } catch (error) {
      console.error('Index: Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleCaptureClose = () => {
    console.log('Index: Capture modal closed, UI should now show updated items');
    setShowCapture(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header
        userEmail={user?.email}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onShowCapture={() => setShowCapture(true)}
        onSignOut={signOut}
      />

      <NavigationTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {error && <ErrorDisplay error={error} />}

      <MainContent
        activeTab={activeTab}
        showFilters={showFilters}
        filters={filters}
        onFiltersChange={setFilters}
        filteredItems={filteredLegacyItems}
        allItems={legacyClothes}
        onDeleteItem={handleDeleteItem}
      />

      {showCapture && (
        <CaptureModal onClose={handleCaptureClose} />
      )}
    </div>
  );
};

export default Index;
