import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Bell, ChevronRight, Clock } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { fetchCategories, fetchFeaturedProducts, fetchRecentOrders } from '@/api/products';
import CategoryList from '@/components/home/CategoryList';
import FeaturedProductList from '@/components/home/FeaturedProductList';
import OrderCard from '@/components/home/OrderCard';
import NotificationBadge from '@/components/home/NotificationBadge';
import { Text, Card } from '@/components/ui';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { isDark, colors } = useTheme();
  
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const categoriesData = await fetchCategories();
      const productsData = await fetchFeaturedProducts();
      const ordersData = await fetchRecentOrders();
      
      setCategories(categoriesData);
      setFeaturedProducts(productsData);
      setRecentOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleProductPress = (productId) => {
    router.push(`/product/${productId}`);
  };
  
  const handleOrderPress = (orderId) => {
    router.push(`/order-tracking/${orderId}`);
  };
  
  const handleNotificationPress = () => {
    router.push('/notifications');
  };
  
  const handleCategoryPress = (categoryId) => {
    router.push({
      pathname: '/search',
      params: { category: categoryId }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F8F8F8' }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.welcomeSection}>
          <Text variant="h3" weight="bold">
            Hello, {user?.name?.split(' ')[0] || 'Guest'}
          </Text>
          <Text variant="body" color="secondary">
            What would you like delivered today?
          </Text>
        </View>
        
        <View style={styles.deliveryTimeContainer}>
          <Card style={[styles.deliveryTimeCard, { backgroundColor: isDark ? colors.primary[900] : colors.primary[50] }]}>
            <Clock size={20} color={colors.primary[600]} />
            <View style={styles.deliveryTimeTextContainer}>
              <Text variant="body-sm" color="secondary">
                Delivery Time
              </Text>
              <Text variant="body" weight="semibold">
                15-30 minutes
              </Text>
            </View>
          </Card>
        </View>
        
        <CategoryList 
          categories={categories} 
          onCategoryPress={handleCategoryPress} 
        />
        
        <FeaturedProductList 
          products={featuredProducts} 
          onProductPress={handleProductPress}
          onAddToCart={addToCart}
        />
        
        {recentOrders.length > 0 && (
          <View style={styles.recentOrdersSection}>
            <View style={styles.sectionHeader}>
              <Text variant="h4" weight="semibold">Recent Orders</Text>
              <TouchableOpacity onPress={() => router.push('/profile/orders')}>
                <Text variant="body-sm" weight="medium" color="accent">See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onPress={() => handleOrderPress(order.id)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  deliveryTimeContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  deliveryTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
  },
  deliveryTimeTextContainer: {
    marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentOrdersSection: {
    marginBottom: 24,
  },
  spacer: {
    height: 100,
  },
});