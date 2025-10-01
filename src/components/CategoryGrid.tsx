import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Laptop, 
  Shirt, 
  Gamepad2, 
  Home, 
  Bike,
  Coffee,
  Dumbbell,
  ArrowRight
} from "lucide-react";

const categories = [
  {
    id: "books",
    name: "Books & Study",
    icon: BookOpen,
    count: 234,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Laptop,
    count: 156,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: Shirt,
    count: 89,
    color: "from-pink-500 to-pink-600"
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: Gamepad2,
    count: 67,
    color: "from-green-500 to-green-600"
  },
  {
    id: "furniture",
    name: "Furniture",
    icon: Home,
    count: 45,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "vehicles",
    name: "Bikes & Scooters",
    icon: Bike,
    count: 23,
    color: "from-red-500 to-red-600"
  },
  {
    id: "food",
    name: "Food & Kitchen",
    icon: Coffee,
    count: 78,
    color: "from-yellow-500 to-yellow-600"
  },
  {
    id: "sports",
    name: "Sports & Fitness",
    icon: Dumbbell,
    count: 34,
    color: "from-teal-500 to-teal-600"
  }
];

const CategoryGrid = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Browse by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you need from fellow hostel students
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <button
                key={category.id}
                className="group relative p-6 rounded-xl border bg-card hover:bg-gradient-card transition-all duration-200 hover:shadow-fretio-md hover:-translate-y-1"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-sm">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {category.count} items
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button variant="outline" size="lg" className="group">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;