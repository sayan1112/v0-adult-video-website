"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { rateVideoAction } from "@/app/actions"

interface VideoRatingProps {
  videoId: string
  initialRating?: number
  onRate?: (rating: number) => void
  readOnly?: boolean
  className?: string
}

export function VideoRating({
  videoId,
  initialRating = 0,
  onRate,
  readOnly = false,
  className,
}: VideoRatingProps) {
  const [rating, setRating] = React.useState(initialRating)
  const [hoverRating, setHoverRating] = React.useState(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleRate = async (value: number) => {
    if (readOnly || isSubmitting) return

    setIsSubmitting(true)
    setRating(value)
    
    try {
       const result = await rateVideoAction(videoId, value)
       
       if (result.success) {
           onRate?.(value)
       }
    } catch (error) {
       console.error("Failed to submit rating", error)
    } finally {
       setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readOnly}
          whileHover={!readOnly ? { scale: 1.2 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
          onMouseLeave={() => !readOnly && setHoverRating(0)}
          onClick={() => handleRate(star)}
          className={cn(
            "relative transition-colors focus:outline-none",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
        >
          <Star
            className={cn(
              "h-5 w-5 transition-all duration-300",
              (hoverRating || rating) >= star
                ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"
                : "fill-transparent text-muted-foreground/30"
            )}
            strokeWidth={(hoverRating || rating) >= star ? 0 : 1.5}
          />
        </motion.button>
      ))}
      <span className="ml-2 text-sm font-medium text-muted-foreground tabular-nums">
        {rating > 0 ? rating.toFixed(1) : "Unrated"}
      </span>
    </div>
  )
}
