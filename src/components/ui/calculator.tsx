// pages/nutrition-calculator.tsx

"use client" // Add this line at the top

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { z, ZodError } from "zod"

// Define the validation schema with zod
const schema = z.object({
    height: z.number().min(1, "Height is required"),
    weight: z.number().min(1, "Weight is required"),
    age: z.number().min(1, "Age is required"),
    activity: z.enum(["sedentary", "light", "moderate", "active", "very-active"], { message: "Activity level is required" }),
})

export default function NutritionCalculator() {
    const [results, setResults] = useState<{ calories: number, protein: number, carbs: number, fat: number, water: number } | null>(null)
    const [errors, setErrors] = useState<{ message: string }[] | null>(null)
    const [activity, setActivity] = useState<string>("")

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const data = {
            height: Number(formData.get("height")),
            weight: Number(formData.get("weight")),
            age: Number(formData.get("age")),
            activity: formData.get("activity") as string,
        }

        try {
            schema.parse(data)

            // Perform calculations based on the form data
            const { height, weight, age, activity } = data
            // Simple logic for daily intake (replace with your own logic)
            const calories = 2000 + (activity === "active" ? 300 : 0) // Example logic
            const protein = weight * 1.5 // Example logic
            const carbs = weight * 3 // Example logic
            const fat = weight * 0.5 // Example logic
            const water = weight * 0.03 // Example logic

            setResults({
                calories,
                protein,
                carbs,
                fat,
                water,
            })
            setErrors(null)
        } catch (error) {
            if (error instanceof ZodError) {
                // Handle validation errors (e.g., display them to the user)
                setErrors(error.errors.map(err => ({ message: err.message })))
            } else {
                // Handle other errors
                console.error("Unexpected error", error)
                setErrors([{ message: "Unexpected error occurred" }])
            }
            setResults(null)
        }
    }

    return (
        <Card className="w-full max-w-2xl my-5 text-red-600">
            <CardHeader>
                <CardTitle>Nutrition Calculator</CardTitle>
                <CardDescription>Get your personalized daily nutrition recommendations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" name="height" type="number" placeholder="Enter your height" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" name="weight" type="number" placeholder="Enter your weight" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" name="age" type="number" placeholder="Enter your age" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="activity">Activity Level</Label>
                            <Select name="activity" onValueChange={(value) => setActivity(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select activity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sedentary">Sedentary</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="very-active">Very Active</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator />
                    <div className="grid gap-4">
                        <button type="submit" className="btn">Calculate</button>
                    </div>
                </form>
                {errors && (
                    <div className="text-red-500">
                        {errors.map((error, index) => (
                            <div key={index}>{error.message}</div>
                        ))}
                    </div>
                )}
                {results && (
                    <div className="space-y-4">
                        <Label>Recommended Daily Intake</Label>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Calories</div>
                                <div className="text-2xl font-bold">{results.calories}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Protein</div>
                                <div className="text-2xl font-bold">{results.protein}g</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Carbs</div>
                                <div className="text-2xl font-bold">{results.carbs}g</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Fat</div>
                                <div className="text-2xl font-bold">{results.fat}g</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Water</div>
                                <div className="text-2xl font-bold">{results.water}L</div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
