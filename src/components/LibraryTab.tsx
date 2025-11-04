import { Training } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, FileText, Clock } from '@phosphor-icons/react'
import { useState } from 'react'

interface LibraryTabProps {
  trainings: Training[]
}

export function LibraryTab({ trainings }: LibraryTabProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTrainings = trainings.filter(training => 
    training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    training.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">Resource Library</h1>
        <p className="text-muted-foreground">
          Access training materials and reference documents
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              placeholder="Search library by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrainings.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <FileText size={48} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-lg font-medium">
                {searchQuery ? 'No results found' : 'No resources available'}
              </p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try a different search term' : 'Check back later for training materials'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTrainings.map((training) => (
            <Card key={training.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <FileText size={32} className="text-primary shrink-0" />
                  <Badge variant="outline" className="text-xs">
                    v{training.version}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{training.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {training.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {training.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {training.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {training.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{training.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock size={16} />
                  <span>{training.estimated_time_minutes} minutes</span>
                </div>
                
                <Button className="w-full" size="sm">
                  View Document
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
