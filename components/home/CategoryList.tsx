import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Text } from '@/components/ui';
import { colors } from '@/utils/theme';
import CategoryCard from '@/components/home/CategoryCard';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface CategoryListProps {
  categories: Category[];
  onCategoryPress: (categoryId: string) => void;
}

export default function CategoryList({ categories, onCategoryPress }: CategoryListProps) {
  const { isDark } = useTheme();
  
  return (
    <View style={styles.categoriesSection}>
      <View style={styles.sectionHeader}>
        <Text variant="h4" weight="semibold">Categories</Text>
        <TouchableOpacity onPress={() => onCategoryPress('')}>
          <Text variant="body-sm" weight="medium" color="accent">See All</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CategoryCard 
            category={item} 
            onPress={() => onCategoryPress(item.id)}
          />
        )}
        contentContainerStyle={styles.categoriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  categoriesSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriesList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
});