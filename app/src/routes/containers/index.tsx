import {createFileRoute, Link} from '@tanstack/react-router'
import {useQuery} from "convex/react";
import {api} from "../../../convex/_generated/api";
import ContainerCard from "@/components/ContainerCard.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useGlobalState} from "@/providers/StateProvider.tsx";
import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import DualRangeSlider from "@/components/dual-range-slider";
import { X } from 'lucide-react';

export const Route: any = createFileRoute('/containers/')({
  component: Index,
})

function Index() {
  const { setState } = useGlobalState();
  const containers = useQuery(api.container.getMyContainers) || [];
  const tags = useQuery(api.tags.getTags) || [];
  const [searchTerm, setSearchTerm] = useState("");
  const [likesRange, setLikesRange] = useState<number[]>([0, 1000]);
  const [viewsRange, setViewsRange] = useState<number[]>([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredContainers = useMemo(() => {
    if (!Array.isArray(containers)) {
      console.error("Containers is not an array:", containers);
      return [];
    }
    return containers.filter((container: any) => {
      const nameMatch = container.name.toLowerCase().includes(searchTerm.toLowerCase());
      const likesCount = Array.isArray(container.likes) ? container.likes.length : 0;
      const likesMatch = likesCount >= likesRange[0] && likesCount <= likesRange[1];
      const viewsCount = container.views || 0;
      const viewsMatch = viewsCount >= viewsRange[0] && viewsCount <= viewsRange[1];
      const tagsMatch = selectedTags.length === 0 || (container.tags && container.tags.some((tag: string) => selectedTags.includes(tag)));
      
      return nameMatch && likesMatch && viewsMatch && tagsMatch;
    });
  }, [containers, searchTerm, likesRange, viewsRange, selectedTags]);

  const toggleTag = (name: string) => {
    setSelectedTags(prev => {
      const newTags = prev.includes(name) 
        ? prev.filter(id => id !== name) 
        : [...prev, name];
      console.log("Toggled tag:", name);
      console.log("New selected tags:", newTags);
      return newTags;
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLikesRange([0, 1000]);
    setViewsRange([0, 1000]);
    setSelectedTags([]);
  };

  const isFilterActive = searchTerm !== "" || likesRange[0] > 0 || likesRange[1] < 1000 || viewsRange[0] > 0 || viewsRange[1] < 1000 || selectedTags.length > 0;

  const renderActiveFilters = () => {
    if (!isFilterActive) return null;

    return (
      <div className="mb-4 flex flex-wrap gap-2">
        {searchTerm && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Search: {searchTerm}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm("")} />
          </Badge>
        )}
        {(likesRange[0] > 0 || likesRange[1] < 1000) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Likes: {likesRange[0]}-{likesRange[1]}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setLikesRange([0, 1000])} />
          </Badge>
        )}
        {(viewsRange[0] > 0 || viewsRange[1] < 1000) && (
          <Badge variant="secondary" className="flex items-center gap-1">
            Views: {viewsRange[0]}-{viewsRange[1]}
            <X className="h-3 w-3 cursor-pointer" onClick={() => setViewsRange([0, 1000])} />
          </Badge>
        )}
        {selectedTags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <main className="flex flex-col lg:flex-row h-full p-4 lg:p-6 space-y-4 lg:space-y-0 lg:space-x-4 items-start">
      <div className="w-full lg:w-2/3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
          {filteredContainers.length > 0 ? (
            filteredContainers.map((container: any) => (
              <Link to={`/containers/${container._id}`} key={container._id} className="flex">
                <ContainerCard container={container} />
              </Link>
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center border border-dashed rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold tracking-tight mb-2">
                  {isFilterActive ? "No matching containers found" : "You have no containers"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {isFilterActive ? "Try adjusting your filters" : "You can start training as soon as you create a container!"}
                </p>
                {!isFilterActive && (
                  <Button onClick={() => setState("openContainerModal", true)}>Add Model</Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right side */}
      <div className="w-full lg:w-1/3 lg:sticky lg:top-6">
        <div className="border border-purple-400 rounded-lg p-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
            <h5 className="text-sm font-medium">Filter</h5>
            {isFilterActive && (
              <Button variant="ghost" onClick={clearFilters} className="text-xs h-8 px-2">
                <X className="w-4 h-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
          {renderActiveFilters()}
          <Input
            type="text"
            placeholder="Search containers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          <div className="space-y-6">
            <div>
              <h6 className="text-sm font-medium mb-2">Tags</h6>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: any) => (
                  <Badge 
                    key={tag._id} 
                    className={`cursor-pointer ${selectedTags.includes(tag._id) ? 'bg-purple-600' : 'bg-purple-400/10'}`}
                    onClick={() => toggleTag(tag._id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <label htmlFor="likes" className="text-sm font-medium block mb-2">Likes</label>
              <DualRangeSlider
                min={0}
                max={1000}
                step={1}
                minStepsBetweenThumbs={1}
                value={likesRange}
                onValueChange={(newValue) => setLikesRange(newValue)}
                formatLabel={(value) => `${value}`}
              />
            </div>
            <div className="space-y-8">
              <label htmlFor="views" className="text-sm font-medium block mb-2">Views</label>
              <DualRangeSlider
                min={0}
                max={1000}
                step={1}
                minStepsBetweenThumbs={1}
                value={viewsRange}
                onValueChange={(newValue) => setViewsRange(newValue)}
                formatLabel={(value) => `${value}`}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
