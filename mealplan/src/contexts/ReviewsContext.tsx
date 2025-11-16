import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Review {
  id: number;
  recipeId: number;
  userId: number;
  rating: number;
  comment: string;
  date: string;
  userName: string;
}

interface ReviewsContextType {
  reviews: Review[];
  addReview: (recipeId: number, rating: number, comment: string) => void;
  editReview: (reviewId: number, rating: number, comment: string) => void;
  deleteReview: (reviewId: number) => void;
  getRecipeReviews: (recipeId: number) => Review[];
  getAverageRating: (recipeId: number) => number;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const addReview = (recipeId: number, rating: number, comment: string) => {
    const newReview: Review = {
      id: Date.now(),
      recipeId,
      userId: 1,
      rating,
      comment,
      date: new Date().toISOString(),
      userName: 'Current User'
    };
    setReviews(prev => [...prev, newReview]);
  };

  const editReview = (reviewId: number, rating: number, comment: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, rating, comment } : review
    ));
  };

  const deleteReview = (reviewId: number) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const getRecipeReviews = (recipeId: number) => {
    return reviews.filter(review => review.recipeId === recipeId);
  };

  const getAverageRating = (recipeId: number) => {
    const recipeReviews = getRecipeReviews(recipeId);
    if (recipeReviews.length === 0) return 0;
    return recipeReviews.reduce((sum, review) => sum + review.rating, 0) / recipeReviews.length;
  };

  return (
    <ReviewsContext.Provider value={{
      reviews,
      addReview,
      editReview,
      deleteReview,
      getRecipeReviews,
      getAverageRating
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) throw new Error('useReviews must be used within ReviewsProvider');
  return context;
};