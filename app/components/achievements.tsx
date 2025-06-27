"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Zap, Target, Clock, Coins, Flame, Crown } from "lucide-react"

interface AchievementsProps {
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

export default function Achievements({ playerStats }: AchievementsProps) {
  const achievements = [
    {
      id: 1,
      title: "First Click",
      description: "Play your first game",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      progress: Math.min(playerStats.gamesPlayed, 1),
      target: 1,
      unlocked: playerStats.gamesPlayed >= 1,
      rarity: "Common",
      reward: "50 XP",
    },
    {
      id: 2,
      title: "Speed Novice",
      description: "Win 5 games",
      icon: <Target className="w-6 h-6 text-blue-500" />,
      progress: Math.min(playerStats.totalWins, 5),
      target: 5,
      unlocked: playerStats.totalWins >= 5,
      rarity: "Common",
      reward: "100 XP + 0.01 SOL",
    },
    {
      id: 3,
      title: "Click Master",
      description: "Win 25 games",
      icon: <Crown className="w-6 h-6 text-purple-500" />,
      progress: Math.min(playerStats.totalWins, 25),
      target: 25,
      unlocked: playerStats.totalWins >= 25,
      rarity: "Rare",
      reward: "300 XP + 0.05 SOL",
    },
    {
      id: 4,
      title: "Speed Demon",
      description: "Achieve a 10-game win streak",
      icon: <Flame className="w-6 h-6 text-red-500" />,
      progress: Math.min(playerStats.currentStreak, 10),
      target: 10,
      unlocked: playerStats.currentStreak >= 10,
      rarity: "Epic",
      reward: "500 XP + 0.1 SOL + Special Badge",
    },
    {
      id: 5,
      title: "High Scorer",
      description: "Score 1000+ points in a single game",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      progress: Math.min(playerStats.highestScore, 1000),
      target: 1000,
      unlocked: playerStats.highestScore >= 1000,
      rarity: "Rare",
      reward: "250 XP + 0.03 SOL",
    },
    {
      id: 6,
      title: "Token Collector",
      description: "Earn 1 SOL in total winnings",
      icon: <Coins className="w-6 h-6 text-green-500" />,
      progress: Math.min(playerStats.totalEarnings * 100, 100),
      target: 100,
      unlocked: playerStats.totalEarnings >= 1,
      rarity: "Epic",
      reward: "400 XP + 0.08 SOL",
    },
    {
      id: 7,
      title: "Gorbagana Legend",
      description: "Reach Level 10",
      icon: <Crown className="w-6 h-6 text-gold-500" />,
      progress: Math.min(playerStats.level, 10),
      target: 10,
      unlocked: playerStats.level >= 10,
      rarity: "Legendary",
      reward: "1000 XP + 0.2 SOL + Legendary Badge",
    },
    {
      id: 8,
      title: "Endurance Champion",
      description: "Play 100 games",
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      progress: Math.min(playerStats.gamesPlayed, 100),
      target: 100,
      unlocked: playerStats.gamesPlayed >= 100,
      rarity: "Epic",
      reward: "600 XP + 0.12 SOL",
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "text-gray-600 border-gray-300"
      case "Rare":
        return "text-blue-600 border-blue-300"
      case "Epic":
        return "text-purple-600 border-purple-300"
      case "Legendary":
        return "text-yellow-600 border-yellow-300"
      default:
        return "text-gray-600 border-gray-300"
    }
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalAchievements = achievements.length

  return (
    <div className="space-y-6">
      {/* Achievement Progress Overview */}
      <Card className="border-2 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <div>
                <CardTitle>Achievement Progress</CardTitle>
                <CardDescription>Track your gaming milestones</CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {unlockedCount}/{totalAchievements}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={(unlockedCount / totalAchievements) * 100} className="h-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-600">
                {achievements.filter((a) => a.rarity === "Common" && a.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Common</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {achievements.filter((a) => a.rarity === "Rare" && a.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Rare</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">
                {achievements.filter((a) => a.rarity === "Epic" && a.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Epic</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-yellow-600">
                {achievements.filter((a) => a.rarity === "Legendary" && a.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Legendary</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            className={`transition-all hover:shadow-md ${
              achievement.unlocked
                ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20"
                : "opacity-75"
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-full ${achievement.unlocked ? "bg-green-100 dark:bg-green-900" : "bg-muted"}`}
                  >
                    {achievement.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{achievement.title}</CardTitle>
                    <CardDescription className="text-sm">{achievement.description}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                  {achievement.rarity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievement.unlocked ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-semibold">Unlocked!</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Progress: {achievement.progress}/{achievement.target}
                    </span>
                  </div>
                  <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                </>
              )}
              <div className="text-xs text-muted-foreground">
                <strong>Reward:</strong> {achievement.reward}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Achievement Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{unlockedCount}</div>
              <div className="text-xs text-muted-foreground">Achievements Unlocked</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {achievements
                  .filter((a) => a.unlocked)
                  .reduce((sum, a) => {
                    const xp = Number.parseInt(a.reward.match(/(\d+) XP/)?.[1] || "0")
                    return sum + xp
                  }, 0)}
              </div>
              <div className="text-xs text-muted-foreground">XP from Achievements</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">
                {((unlockedCount / totalAchievements) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Completion Rate</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">
                {achievements.filter((a) => a.rarity === "Legendary" && a.unlocked).length}
              </div>
              <div className="text-xs text-muted-foreground">Legendary Unlocked</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
