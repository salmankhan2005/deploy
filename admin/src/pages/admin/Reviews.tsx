import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, ThumbsUp, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reviews = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [reviews, setReviews] = useState([
    { id: 1, recipe: "Mediterranean Quinoa Bowl", user: "John Doe", rating: 5, comment: "Absolutely delicious! Easy to make and very healthy.", status: "Approved", date: "2024-03-15", helpful: 23 },
    { id: 2, recipe: "Grilled Salmon", user: "Jane Smith", rating: 4, comment: "Great recipe but cooking time could be shorter.", status: "Approved", date: "2024-03-14", helpful: 12 },
    { id: 3, recipe: "Thai Green Curry", user: "Mike Johnson", rating: 5, comment: "Best curry recipe I've tried! Perfect spice level.", status: "Pending", date: "2024-03-13", helpful: 8 },
    { id: 4, recipe: "Caesar Salad", user: "Sarah Williams", rating: 3, comment: "Good but missing some traditional ingredients.", status: "Approved", date: "2024-03-12", helpful: 5 },
    { id: 5, recipe: "Overnight Oats", user: "Tom Brown", rating: 5, comment: "Perfect breakfast! So quick and customizable.", status: "Pending", date: "2024-03-11", helpful: 15 },
  ]);

  const handleApprove = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    toast({ title: "Review Approved", description: "Review has been approved and published" });
  };

  const handleReject = (id: number) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
    toast({ title: "Review Rejected", description: "Review has been rejected" });
  };

  const handleDelete = (id: number) => {
    setReviews(reviews.filter(r => r.id !== id));
    toast({ title: "Review Deleted", description: "Review removed successfully" });
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.recipe.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || review.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
      />
    ));
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold">Reviews & Ratings</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">Manage user reviews and feedback</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reviews</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium">{review.recipe}</h3>
                          <p className="text-sm text-muted-foreground">by {review.user}</p>
                        </div>
                        <Badge 
                          variant={
                            review.status === "Approved" 
                              ? "default" 
                              : review.status === "Pending" 
                              ? "secondary" 
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {review.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(review.rating)}
                      </div>
                      
                      <p className="text-sm mb-2">{review.comment}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{review.date}</span>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {review.helpful} helpful
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {review.status === "Pending" && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="gap-1"
                            onClick={() => handleApprove(review.id)}
                          >
                            <CheckCircle className="h-3 w-3" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="gap-1"
                            onClick={() => handleReject(review.id)}
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reviews;
