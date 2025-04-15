import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import ProductCard from '@/components/home/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
}

interface FeaturedProductListProps {
  products: Product[];
  onProductPress: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function FeaturedProductList({ products, onProductPress, onAddToCart }: FeaturedProductListProps) {
  const { isDark } = useTheme();
  
  return (
    <View style={styles.featuredSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Featured Products</Text>
        <TouchableOpacity onPress={() => onProductPress('')}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductCard 
            product={item} 
            onPress={() => onProductPress(item.id)}
            onAddToCart={() => onAddToCart(item)}
          />
        )}
        contentContainerStyle={styles.productsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  featuredSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  productsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});