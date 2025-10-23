import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "trending" | "recent" | "suggestion";
}

const TRENDING_SEARCHES = [
  "Laptops",
  "Books",
  "Gaming Mouse",
  "Study Desk",
  "Bicycle",
  "Guitar",
  "Textbooks",
  "Furniture"
];

const SearchAutocomplete = ({ 
  value, 
  onChange, 
  placeholder = "Search products...",
  className,
  onSearch
}: SearchAutocompleteProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("fretio-recent-searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Generate suggestions based on input
  useEffect(() => {
    if (!value.trim()) {
      // Show trending and recent when input is empty
      const trending: SearchSuggestion[] = TRENDING_SEARCHES.slice(0, 4).map((text, i) => ({
        id: `trending-${i}`,
        text,
        type: "trending" as const,
      }));
      
      const recent: SearchSuggestion[] = recentSearches.slice(0, 3).map((text, i) => ({
        id: `recent-${i}`,
        text,
        type: "recent" as const,
      }));
      
      setSuggestions([...recent, ...trending]);
    } else {
      // Filter suggestions based on input
      const filtered = TRENDING_SEARCHES
        .filter(item => item.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5)
        .map((text, i) => ({
          id: `suggestion-${i}`,
          text,
          type: "suggestion" as const,
        }));
      
      setSuggestions(filtered);
    }
    setHighlightedIndex(-1);
  }, [value, recentSearches]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem("fretio-recent-searches", JSON.stringify(updated));
  };

  const handleSelectSuggestion = (text: string) => {
    onChange(text);
    saveRecentSearch(text);
    setIsFocused(false);
    if (onSearch) {
      onSearch(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelectSuggestion(suggestions[highlightedIndex].text);
        } else if (value.trim()) {
          saveRecentSearch(value);
          setIsFocused(false);
          if (onSearch) {
            onSearch(value);
          }
        }
        break;
      case "Escape":
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("fretio-recent-searches");
  };

  const showDropdown = isFocused && suggestions.length > 0;

  return (
    <div ref={wrapperRef} className={cn("relative flex-1", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "pl-10 pr-4 transition-all duration-200",
            isFocused && "ring-2 ring-primary ring-offset-2"
          )}
          aria-label="Search products"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showDropdown}
        />
      </div>

      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-fretio-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Header */}
          {!value.trim() && recentSearches.length > 0 && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Recent Searches
              </span>
              <button
                onClick={handleClearRecentSearches}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Suggestions List */}
          <div className="max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => {
              const isHighlighted = index === highlightedIndex;
              const Icon = suggestion.type === "trending" ? TrendingUp : 
                          suggestion.type === "recent" ? Clock : Search;
              
              return (
                <button
                  key={suggestion.id}
                  role="option"
                  aria-selected={isHighlighted}
                  onClick={() => handleSelectSuggestion(suggestion.text)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 transition-all duration-150",
                    "hover:bg-muted/50 active:bg-muted",
                    isHighlighted && "bg-muted/50",
                    "border-b border-border/50 last:border-0"
                  )}
                >
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                    suggestion.type === "trending" && "bg-amber-100 text-amber-600",
                    suggestion.type === "recent" && "bg-blue-100 text-blue-600",
                    suggestion.type === "suggestion" && "bg-primary/10 text-primary"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-foreground">
                      {value && suggestion.text.toLowerCase().includes(value.toLowerCase()) ? (
                        <>
                          {suggestion.text.split(new RegExp(`(${value})`, 'gi')).map((part, i) => 
                            part.toLowerCase() === value.toLowerCase() ? (
                              <span key={i} className="text-primary font-semibold">{part}</span>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </>
                      ) : (
                        suggestion.text
                      )}
                    </div>
                    {suggestion.type === "trending" && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Trending search
                      </div>
                    )}
                  </div>

                  {suggestion.type === "recent" && (
                    <X 
                      className="h-4 w-4 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = recentSearches.filter(s => s !== suggestion.text);
                        setRecentSearches(updated);
                        localStorage.setItem("fretio-recent-searches", JSON.stringify(updated));
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer with trending badge */}
          {value.trim() && suggestions.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No suggestions found for "{value}"
            </div>
          )}

          {!value.trim() && suggestions.length > 3 && (
            <div className="px-4 py-3 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Showing trending searches in your area</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;


