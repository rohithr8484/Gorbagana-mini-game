"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Share2, Users, MessageCircle, Heart, Trophy, Zap, Gift, Crown } from "lucide-react"

interface SocialHubProps {
  playerStats: {
    gamesPlayed: number
    totalWins: number
    totalEarnings: number
    highestScore: number
    currentStreak: number
    level: number
    xp: number
  }
  networkStats: {
    tps: number
    avgLatency: number
    activeGames: number
    totalPlayers: number
    dailyVolume: number
  }
}

export default function SocialHub({ playerStats, networkStats }: SocialHubProps) {
  const recentActivity = [
    {
      id: 1,
      player: "ClickMaster",
      action: "achieved a new high score of 1,247 points!",
      time: "2 minutes ago",
      type: "achievement",
      icon: <Trophy className="w-4 h-4 text-yellow-500" />,
    },
    {
      id: 2,
      player: "SpeedDemon",
      action: "won 5 games in a row and earned 0.25 SOL!",
      time: "5 minutes ago",
      type: "streak",
      icon: <Zap className="w-4 h-4 text-blue-500" />,
    },
    {
      id: 3,
      player: "PrecisionPro",
      action: "unlocked the 'Click Master' achievement!",
      time: "8 minutes ago",
      type: "achievement",
      icon: <Crown className="w-4 h-4 text-purple-500" />,
    },
    {
      id: 4,
      player: "TokenHunter",
      action: "completed the daily challenge and earned bonus XP!",
      time: "12 minutes ago",
      type: "challenge",
      icon: <Gift className="w-4 h-4 text-green-500" />,
    },
  ]

  const topPlayers = [
    { rank: 1, name: "GorbaganaKing", score: 2847, earnings: "1.24 SOL", streak: 15 },
    { rank: 2, name: "ClickLegend", score: 2634, earnings: "1.18 SOL", streak: 12 },
    { rank: 3, name: "SpeedMaster", score: 2521, earnings: "1.05 SOL", streak: 8 },
    { rank: 4, name: "PrecisionAce", score: 2398, earnings: "0.98 SOL", streak: 6 },
    { rank: 5, name: "TokenChamp", score: 2287, earnings: "0.87 SOL", streak: 4 },
  ]

  const shareAchievement = (achievement: string) => {
    const shareText = `🎮 Just ${achievement} in Gorbagana Speed Clicker! The fastest clicking game on Solana's testnet. Can you beat my score? 🚀⚡`

    if (navigator.share) {
      navigator.share({
        title: "Gorbagana Speed Clicker Achievement",
        text: shareText,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(`${shareText} ${window.location.href}`)
      alert("Achievement shared to clipboard!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Community Stats */}
      <Card className="border-2 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Gorbagana Community
          </CardTitle>
          <CardDescription>Live stats from the fastest gaming community on Solana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">{networkStats.totalPlayers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Active Players</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{networkStats.activeGames}</div>
              <div className="text-xs text-muted-foreground">Games Playing Now</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-purple-600">{networkStats.dailyVolume.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">SOL Daily Volume</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{networkStats.tps.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Network TPS</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              Live Activity Feed
            </CardTitle>
            <CardDescription>See what other players are achieving</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{activity.player.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {activity.icon}
                    <span className="font-semibold text-sm">{activity.player}</span>
                    <Badge variant="outline" className="text-xs">
                      Level {Math.floor(Math.random() * 10) + 1}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
                <Button size="sm" variant="ghost" className="p-1">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              Load More Activity
            </Button>
          </CardContent>
        </Card>

        {/* Top Players This Week */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Weekly Leaderboard
            </CardTitle>
            <CardDescription>Top performers this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPlayers.map((player) => (
              <div key={player.rank} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      player.rank === 1
                        ? "bg-yellow-500 text-white"
                        : player.rank === 2
                          ? "bg-gray-400 text-white"
                          : player.rank === 3
                            ? "bg-amber-600 text-white"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {player.rank}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{player.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {player.score.toLocaleString()} points • {player.earnings}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="text-xs">
                    {player.streak} streak
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              View Full Leaderboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Share Your Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-500" />
            Share Your Success
          </CardTitle>
          <CardDescription>Let the world know about your Gorbagana achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => shareAchievement(`reached Level ${playerStats.level}`)}
              className="flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Share Level Progress
            </Button>
            <Button
              onClick={() => shareAchievement(`achieved a high score of ${playerStats.highestScore}`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Share High Score
            </Button>
            <Button
              onClick={() => shareAchievement(`earned ${playerStats.totalEarnings.toFixed(3)} SOL`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Share Earnings
            </Button>
            <Button
              onClick={() => shareAchievement(`won ${playerStats.currentStreak} games in a row`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Gift className="w-4 h-4" />
              Share Win Streak
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Program */}
      <Card className="border-2 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-500" />
            Referral Rewards
          </CardTitle>
          <CardDescription>Invite friends and earn bonus tokens together</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0.01 SOL</div>
              <div className="text-sm text-muted-foreground">For each friend who joins</div>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0.005 SOL</div>
              <div className="text-sm text-muted-foreground">For your friend's first win</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">5%</div>
              <div className="text-sm text-muted-foreground">Of friend's winnings (first week)</div>
            </div>
          </div>
          <Button className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Get Your Referral Link
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
