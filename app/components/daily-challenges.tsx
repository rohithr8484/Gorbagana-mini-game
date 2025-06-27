"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Gift, Target, Zap, Clock, Trophy, Coins, Star } from "lucide-react"

interface DailyChallengesProps {
  playerStats: {
    gamesPlayed: number
    totalWins: number
    totalEarnings: number
    highestScore: number
    currentStreak: number
    level: number
    xp: number
  }
}

export default function DailyChallenges({ playerStats }: DailyChallengesProps) {
  const challenges = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Win 3 Speed Click games in a row",
      progress: Math.min(playerStats.currentStreak, 3),
      target: 3,
      reward: "0.02 SOL + 100 XP",
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      difficulty: "Easy",
      timeLeft: "18h 32m",
    },
    {
      id: 2,
      title: "Precision Master",
      description: "Score 500+ points in Precision Click mode",
      progress: Math.min(playerStats.highestScore, 500),
      target: 500,
      reward: "0.05 SOL + 200 XP",
      icon: <Target className="w-5 h-5 text-blue-500" />,
      difficulty: "Medium",
      timeLeft: "18h 32m",
    },
    {
      id: 3,
      title: "Endurance Champion",
      description: "Complete 5 Endurance Click games today",
      progress: Math.min(playerStats.gamesPlayed, 5),
      target: 5,
      reward: "0.08 SOL + 300 XP",
      icon: <Clock className="w-5 h-5 text-purple-500" />,
      difficulty: "Hard",
      timeLeft: "18h 32m",
    },
    {
      id: 4,
      title: "Token Collector",
      description: "Earn 0.1 SOL in total winnings",
      progress: Math.min(playerStats.totalEarnings * 100, 10),
      target: 10,
      reward: "0.03 SOL + 150 XP",
      icon: <Coins className="w-5 h-5 text-green-500" />,
      difficulty: "Medium",
      timeLeft: "18h 32m",
    },
  ]

  const weeklyChallenge = {
    title: "Gorbagana Champion",
    description: "Reach the top 10 on the weekly leaderboard",
    progress: 15,
    target: 10,
    reward: "0.5 SOL + Exclusive Badge + 1000 XP",
    timeLeft: "4d 12h",
  }

  return (
    <div className="space-y-6">
      {/* Weekly Challenge */}
      <Card className="border-2 border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <CardTitle className="text-yellow-700 dark:text-yellow-300">Weekly Challenge</CardTitle>
                <CardDescription>{weeklyChallenge.description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-yellow-500 text-yellow-700">
              {weeklyChallenge.timeLeft} left
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>Current Rank: #{weeklyChallenge.progress}</span>
            <span className="text-green-600 font-semibold">{weeklyChallenge.reward}</span>
          </div>
          <Progress
            value={Math.max(
              0,
              ((weeklyChallenge.target - weeklyChallenge.progress + 1) / weeklyChallenge.target) * 100,
            )}
            className="h-3"
          />
          <p className="text-xs text-muted-foreground">
            {weeklyChallenge.progress > weeklyChallenge.target
              ? "🎉 Challenge completed! Rewards will be distributed at week end."
              : `Climb ${weeklyChallenge.progress - weeklyChallenge.target} more ranks to complete this challenge`}
          </p>
        </CardContent>
      </Card>

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5 text-purple-500" />
          <h2 className="text-xl font-semibold">Daily Challenges</h2>
          <Badge variant="secondary">Resets in 18h 32m</Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {challenge.icon}
                    <div>
                      <CardTitle className="text-base">{challenge.title}</CardTitle>
                      <CardDescription className="text-sm">{challenge.description}</CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      challenge.difficulty === "Easy"
                        ? "secondary"
                        : challenge.difficulty === "Medium"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>
                    Progress: {challenge.progress}/{challenge.target}
                  </span>
                  <span className="text-green-600 font-semibold">{challenge.reward}</span>
                </div>
                <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                {challenge.progress >= challenge.target ? (
                  <Button size="sm" className="w-full">
                    <Gift className="w-4 h-4 mr-2" />
                    Claim Reward
                  </Button>
                ) : (
                  <div className="text-xs text-muted-foreground text-center">
                    {challenge.target - challenge.progress} more to complete
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Challenge Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Challenge Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">Challenges Completed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">0.24</div>
              <div className="text-xs text-muted-foreground">SOL Earned from Challenges</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">1,850</div>
              <div className="text-xs text-muted-foreground">XP from Challenges</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
