import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, MapPin, Save, X, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SearchFilters {
  priceRange: [number, number];
  location: string;
  distance: number;
  conditions: string[];
  categories: string[];
  listingTypes: string[];
  sortBy: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  created_at: string;
}

interface AdvancedSearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onSearchHistorySelect?: (query: string) => void;
  initialFilters?: Partial<SearchFilters>;
  categories: Array<{ id: string; name: string }>;
}

const MAX_PRICE = 100000;
const CONDITIONS = ["new", "like_new", "good", "fair", "poor"];
const LISTING_TYPES = ["sell", "rent", "both"];
const SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "views", label: "Most Viewed" },
  { value: "distance", label: "Distance: Nearest" },
];

const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
  onFiltersChange,
  onSearchHistorySelect,
  initialFilters,
  categories,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [saveSearchName, setSaveSearchName] = useState("");

  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: initialFilters?.priceRange || [0, MAX_PRICE],
    location: initialFilters?.location || "",
    distance: initialFilters?.distance || 5,
    conditions: initialFilters?.conditions || [],
    categories: initialFilters?.categories || [],
    listingTypes: initialFilters?.listingTypes || [],
    sortBy: initialFilters?.sortBy || "recent",
  });

  useEffect(() => {
    if (user) {
      fetchSavedSearches();
      fetchSearchHistory();
    }
  }, [user]);

  const fetchSavedSearches = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data && !error) {
      setSavedSearches(data);
    }
  };

  const fetchSearchHistory = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("search_history")
      .select("query")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data && !error) {
      setSearchHistory(data.map(item => item.query));
    }
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
  };

  const handleConditionToggle = (condition: string) => {
    const updatedConditions = filters.conditions.includes(condition)
      ? filters.conditions.filter((c) => c !== condition)
      : [...filters.conditions, condition];
    handleFilterChange({ conditions: updatedConditions });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const updatedCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter((c) => c !== categoryId)
      : [...filters.categories, categoryId];
    handleFilterChange({ categories: updatedCategories });
  };

  const handleListingTypeToggle = (type: string) => {
    const updatedTypes = filters.listingTypes.includes(type)
      ? filters.listingTypes.filter((t) => t !== type)
      : [...filters.listingTypes, type];
    handleFilterChange({ listingTypes: updatedTypes });
  };

  const applyFilters = () => {
    onFiltersChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: SearchFilters = {
      priceRange: [0, MAX_PRICE],
      location: "",
      distance: 5,
      conditions: [],
      categories: [],
      listingTypes: [],
      sortBy: "recent",
    };
    setFilters(defaultFilters);
  };

  const saveSearch = async () => {
    if (!user || !saveSearchName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your saved search",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("saved_searches").insert({
      user_id: user.id,
      name: saveSearchName,
      filters: filters,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save search",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Search saved successfully",
      });
      setSaveSearchName("");
      fetchSavedSearches();
    }
  };

  const loadSavedSearch = (savedSearch: SavedSearch) => {
    setFilters(savedSearch.filters);
    applyFilters();
  };

  const deleteSavedSearch = async (id: string) => {
    const { error } = await supabase
      .from("saved_searches")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchSavedSearches();
      toast({
        title: "Success",
        description: "Saved search deleted",
      });
    }
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_PRICE) count++;
    if (filters.location) count++;
    if (filters.conditions.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.listingTypes.length > 0) count++;
    if (filters.sortBy !== "recent") count++;
    return count;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
          {activeFiltersCount() > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {activeFiltersCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Advanced Search Filters</SheetTitle>
          <SheetDescription>
            Refine your search with advanced filtering options
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label>Price Range</Label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  handleFilterChange({ priceRange: value as [number, number] })
                }
                max={MAX_PRICE}
                step={100}
                className="mt-2"
              />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>₹{filters.priceRange[0].toLocaleString()}</span>
              <span>₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label>Location</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter location"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange({ location: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
              <Select
                value={filters.distance.toString()}
                onValueChange={(value) =>
                  handleFilterChange({ distance: parseInt(value) })
                }
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 km</SelectItem>
                  <SelectItem value="2">2 km</SelectItem>
                  <SelectItem value="5">5 km</SelectItem>
                  <SelectItem value="10">10 km</SelectItem>
                  <SelectItem value="20">20 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Condition */}
          <div className="space-y-3">
            <Label>Condition</Label>
            <div className="space-y-2">
              {CONDITIONS.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.conditions.includes(condition)}
                    onCheckedChange={() => handleConditionToggle(condition)}
                  />
                  <Label className="text-sm font-normal capitalize">
                    {condition.replace("_", " ")}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <Label>Categories</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.categories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <Label className="text-sm font-normal">{category.name}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Listing Type */}
          <div className="space-y-3">
            <Label>Listing Type</Label>
            <div className="space-y-2">
              {LISTING_TYPES.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    checked={filters.listingTypes.includes(type)}
                    onCheckedChange={() => handleListingTypeToggle(type)}
                  />
                  <Label className="text-sm font-normal capitalize">
                    {type === "both" ? "Sell & Rent" : type}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => handleFilterChange({ sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Search */}
          {user && (
            <div className="space-y-3 border-t pt-4">
              <Label>Save This Search</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search name"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                />
                <Button onClick={saveSearch} size="sm" variant="outline">
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="space-y-3 border-t pt-4">
              <Label>Saved Searches</Label>
              <div className="space-y-2">
                {savedSearches.map((search) => (
                  <div
                    key={search.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => loadSavedSearch(search)}
                      className="flex-1 justify-start"
                    >
                      {search.name}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSavedSearch(search.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {searchHistory.length > 0 && onSearchHistorySelect && (
            <div className="space-y-3 border-t pt-4">
              <Label className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Searches
              </Label>
              <div className="space-y-1">
                {searchHistory.map((query, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      onSearchHistorySelect(query);
                      setIsOpen(false);
                    }}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={resetFilters} className="flex-1">
              Reset
            </Button>
            <Button onClick={applyFilters} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AdvancedSearchFilters;
