"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Trophy, Medal, Award, Zap, Clock, Target, Coins, TrendingUp } from "lucide-react"

interface LeaderboardProps {
  onBack: () => void
}

interface LeaderboardEntry {
  rank: number
  player: string
  score: number
  gameMode: string
  timestamp: string
  reward: number
  tokensEarned: number
}

export default function Leaderboard({ onBack }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "alltime">("daily")

  useEffect(() => {
    // Simulate leaderboard data with token economics
    const generateLeaderboard = () => {
      const players = [
        "SpeedDemon",
        "ClickMaster",
        "FastFingers",
        "QuickDraw",
        "RapidFire",
        "LightningClick",
        "ThunderClap",
        "BlazeClick",
      ]
      const gameModes = ["speed-click", "precision-click", "endurance-click"]
      const rewards = [0.05, 0.08, 0.12]

      return Array.from({ length: 20 }, (_, i) => {
        const modeIndex = Math.floor(Math.random() * gameModes.length)
        const baseReward = rewards[modeIndex]
        return {
          rank: i + 1,
          player: players[Math.floor(Math.random() * players.length)] + Math.floor(Math.random() * 1000),
          score: Math.floor(Math.random() * 500) + 100,
          gameMode: gameModes[modeIndex],
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          reward: baseReward,
          tokensEarned: baseReward * (Math.floor(Math.random() * 5) + 1), // Multiple wins
        }
      })
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }))
    }

    setLeaderboardData(generateLeaderboard())
  }, [selectedPeriod])

  const getGameModeIcon = (mode: string) => {
    switch (mode) {
      case "speed-click":
        return <Zap className="w-4 h-4" />
      case "precision-click":
        return <Target className="w-4 h-4" />
      case "endurance-click":
        return <Clock className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getGameModeName = (mode: string) => {
    switch (mode) {
      case "speed-click":
        return "Speed Click"
      case "precision-click":
        return "Precision Click"
      case "endurance-click":
        return "Endurance Click"
      default:
        return "Speed Click"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return (
          <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">
            #{rank}
          </span>
        )
    }
  }

  const totalTokensDistributed = leaderboardData.reduce((sum, entry) => sum + entry.tokensEarned, 0)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground">Top players earning test tokens on Gorbagana testnet</p>
        </div>
      </div>

      {/* Token Distribution Alert */}
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <Coins className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            💰 Total test tokens distributed this period: <strong>{totalTokensDistributed.toFixed(3)} SOL</strong>
          </span>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Gorbagana Testnet</Badge>
            <Badge variant="outline">Zero MEV</Badge>
          </div>
        </AlertDescription>
      </Alert>

      {/* Period Selection */}
      <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="alltime">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-4">
          {/* Top 3 Podium */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {leaderboardData.slice(0, 3).map((entry, index) => (
              <Card
                key={entry.rank}
                className={`text-center ${
                  index === 0
                    ? "ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                    : index === 1
                      ? "ring-2 ring-gray-400 bg-gray-50 dark:bg-gray-950/20"
                      : "ring-2 ring-amber-600 bg-amber-50 dark:bg-amber-950/20"
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">{getRankIcon(entry.rank)}</div>
                  <CardTitle className="text-lg">{entry.player}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1">
                    {getGameModeIcon(entry.gameMode)}
                    {getGameModeName(entry.gameMode)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entry.score}</div>
                  <div className="text-sm text-muted-foreground">points</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center justify-center gap-1">
                    <Coins className="w-3 h-3" />
                    {entry.tokensEarned.toFixed(3)} SOL earned
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Full Rankings & Token Earnings</CardTitle>
              <CardDescription>
                Complete leaderboard showing test token rewards for {selectedPeriod} period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {leaderboardData.map((entry) => (
                  <div
                    key={`${entry.rank}-${entry.player}`}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.rank <= 3 ? "bg-muted/50" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
                      <div>
                        <div className="font-medium">{entry.player}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getGameModeIcon(entry.gameMode)}
                          <span>{getGameModeName(entry.gameMode)}</span>
                          <span>•</span>
                          <span>{entry.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{entry.score} pts</div>
                      <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Coins className="w-3 h-3" />
                        {entry.tokensEarned.toFixed(3)} SOL
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Token Economics Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Total Distributed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalTokensDistributed.toFixed(2)} SOL</div>
                <div className="text-xs text-muted-foreground">Test tokens earned by players</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Games Played</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  +23% from last period
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Highest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{leaderboardData[0]?.score || 0}</div>
                <div className="text-xs text-muted-foreground">by {leaderboardData[0]?.player}</div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Avg Transaction Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">47ms</div>
                <div className="text-xs text-muted-foreground">Gorbagana testnet speed</div>
              </CardContent>
            </Card>
          </div>

          {/* Token Distribution by Game Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Token Distribution by Game Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">Speed Click</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {leaderboardData
                      .filter((e) => e.gameMode === "speed-click")
                      .reduce((sum, e) => sum + e.tokensEarned, 0)
                      .toFixed(2)}{" "}
                    SOL
                  </div>
                  <div className="text-xs text-muted-foreground">0.05 SOL per win</div>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Precision Click</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {leaderboardData
                      .filter((e) => e.gameMode === "precision-click")
                      .reduce((sum, e) => sum + e.tokensEarned, 0)
                      .toFixed(2)}{" "}
                    SOL
                  </div>
                  <div className="text-xs text-muted-foreground">0.08 SOL per win</div>
                </div>

                <div className="text-center p-3 border rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Endurance Click</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {leaderboardData
                      .filter((e) => e.gameMode === "endurance-click")
                      .reduce((sum, e) => sum + e.tokensEarned, 0)
                      .toFixed(2)}{" "}
                    SOL
                  </div>
                  <div className="text-xs text-muted-foreground">0.12 SOL per win</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
