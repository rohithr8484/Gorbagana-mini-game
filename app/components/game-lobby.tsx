"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { PublicKey } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, Clock, Zap, Target, Coins, AlertTriangle, Wallet, Trophy, Star, Flame } from "lucide-react"

interface GameLobbyProps {
  onStartGame: () => void
  onBack: () => void
  wallet: PublicKey | null
  balance: number
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

interface GameMode {
  id: string
  name: string
  description: string
  duration: number
  entryFee: number
  reward: number
  maxPlayers: number
  icon: React.ReactNode
  difficulty: string
  features: string[]
}

export default function GameLobby({ onStartGame, onBack, wallet, balance, playerStats, networkStats }: GameLobbyProps) {
  const [selectedMode, setSelectedMode] = useState<string>("speed-click")
  const [playersInLobby, setPlayersInLobby] = useState<number>(1)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedPowerUps, setSelectedPowerUps] = useState<string[]>([])

  const gameModes: GameMode[] = [
    {
      id: "speed-click",
      name: "Speed Click",
      description: "Click as fast as you can in 30 seconds",
      duration: 30,
      entryFee: 0.01,
      reward: 0.05,
      maxPlayers: 8,
      icon: <Zap className="w-5 h-5" />,
      difficulty: "Easy",
      features: ["Power-ups enabled", "Combo multipliers", "Real-time leaderboard"],
    },
    {
      id: "precision-click",
      name: "Precision Click",
      description: "Hit moving targets with accuracy",
      duration: 60,
      entryFee: 0.02,
      reward: 0.08,
      maxPlayers: 6,
      icon: <Target className="w-5 h-5" />,
      difficulty: "Medium",
      features: ["Moving targets", "Accuracy bonuses", "Skill-based scoring"],
    },
    {
      id: "endurance-click",
      name: "Endurance Click",
      description: "Maintain clicking rhythm for 2 minutes",
      duration: 120,
      entryFee: 0.03,
      reward: 0.12,
      maxPlayers: 4,
      icon: <Clock className="w-5 h-5" />,
      difficulty: "Hard",
      features: ["Stamina system", "Rhythm bonuses", "Endurance rewards"],
    },
  ]

  const powerUps = [
    { id: "double-click", name: "Double Click", cost: 0.005, description: "Each click counts as 2 for 10 seconds" },
    { id: "precision-mode", name: "Precision Mode", cost: 0.003, description: "Bonus points for accurate clicks" },
    { id: "shield", name: "Shield", cost: 0.004, description: "Protect your score from penalties" },
  ]

  useEffect(() => {
    // Simulate players joining/leaving lobby
    const interval = setInterval(() => {
      setPlayersInLobby((prev) => Math.max(1, prev + Math.floor(Math.random() * 3) - 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      onStartGame()
    }
  }, [countdown, onStartGame])

  const handleFindMatch = () => {
    const selectedGameMode = gameModes.find((mode) => mode.id === selectedMode)
    if (!selectedGameMode) return

    const totalCost =
      selectedGameMode.entryFee +
      selectedPowerUps.reduce((sum, id) => {
        const powerUp = powerUps.find((p) => p.id === id)
        return sum + (powerUp?.cost || 0)
      }, 0)

    if (balance < totalCost) {
      alert(`Insufficient balance! You need ${totalCost.toFixed(3)} SOL to play with selected power-ups.`)
      return
    }

    setIsSearching(true)
    // Simulate matchmaking and token deduction
    setTimeout(() => {
      setIsSearching(false)
      setCountdown(5)
    }, 2000)
  }

  const togglePowerUp = (powerUpId: string) => {
    setSelectedPowerUps((prev) =>
      prev.includes(powerUpId) ? prev.filter((id) => id !== powerUpId) : [...prev, powerUpId],
    )
  }

  const selectedGameMode = gameModes.find((mode) => mode.id === selectedMode)
  const totalCost =
    (selectedGameMode?.entryFee || 0) +
    selectedPowerUps.reduce((sum, id) => {
      const powerUp = powerUps.find((p) => p.id === id)
      return sum + (powerUp?.cost || 0)
    }, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Enhanced Header with Player Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Game Lobby</h1>
            <p className="text-muted-foreground">Choose your game mode and prepare for battle</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="font-semibold">Level {playerStats.level}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {playerStats.totalWins} wins • {playerStats.currentStreak} streak
          </div>
        </div>
      </div>

      {/* Enhanced Balance Alert with Network Stats */}
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <Wallet className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>
              💰 Balance: <strong>{balance.toFixed(4)} SOL</strong>
            </span>
            <span>
              🚀 Network: <strong>{networkStats.tps.toLocaleString()} TPS</strong>
            </span>
            <span>
              ⚡ Latency: <strong>{networkStats.avgLatency}ms</strong>
            </span>
          </div>
          <Badge variant="secondary">Backpack Connected</Badge>
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enhanced Game Modes */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="modes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="modes">Game Modes</TabsTrigger>
              <TabsTrigger value="powerups">Power-ups</TabsTrigger>
            </TabsList>

            <TabsContent value="modes" className="space-y-4">
              <h2 className="text-xl font-semibold">Select Game Mode</h2>
              <div className="grid gap-4">
                {gameModes.map((mode) => (
                  <Card
                    key={mode.id}
                    className={`cursor-pointer transition-all ${
                      selectedMode === mode.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                    } ${balance < mode.entryFee ? "opacity-50" : ""}`}
                    onClick={() => balance >= mode.entryFee && setSelectedMode(mode.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {mode.icon}
                          {mode.name}
                          <Badge
                            variant={
                              mode.difficulty === "Easy"
                                ? "secondary"
                                : mode.difficulty === "Medium"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {mode.difficulty}
                          </Badge>
                          {balance < mode.entryFee && <Badge variant="destructive">Insufficient Balance</Badge>}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{mode.duration}s</Badge>
                          <Badge variant="outline" className="text-red-600">
                            <Coins className="w-3 h-3 mr-1" />
                            {mode.entryFee} SOL
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-3">{mode.description}</CardDescription>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="text-green-600 dark:text-green-400">🏆 Winner: {mode.reward} SOL</div>
                          <div className="text-muted-foreground">Max {mode.maxPlayers} players</div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {mode.features.map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="powerups" className="space-y-4">
              <h2 className="text-xl font-semibold">Select Power-ups</h2>
              <div className="grid gap-3">
                {powerUps.map((powerUp) => (
                  <Card
                    key={powerUp.id}
                    className={`cursor-pointer transition-all ${
                      selectedPowerUps.includes(powerUp.id)
                        ? "ring-2 ring-orange-500 bg-orange-50 dark:bg-orange-950/20"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => togglePowerUp(powerUp.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold">{powerUp.name}</div>
                            <div className="text-sm text-muted-foreground">{powerUp.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-orange-600">
                            +{powerUp.cost} SOL
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enhanced Lobby Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Lobby Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{playersInLobby}</div>
                <div className="text-sm text-muted-foreground">Players Online</div>
              </div>

              {selectedGameMode && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Selected Configuration:</div>
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedGameMode.icon}
                      <span className="font-medium">{selectedGameMode.name}</span>
                      <Badge variant="secondary">{selectedGameMode.difficulty}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">Duration: {selectedGameMode.duration}s</div>
                    <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      Entry Fee: {selectedGameMode.entryFee} SOL
                    </div>
                    {selectedPowerUps.length > 0 && (
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        Power-ups: +
                        {selectedPowerUps
                          .reduce((sum, id) => {
                            const powerUp = powerUps.find((p) => p.id === id)
                            return sum + (powerUp?.cost || 0)
                          }, 0)
                          .toFixed(3)}{" "}
                        SOL
                      </div>
                    )}
                    <div className="text-xs text-green-600 dark:text-green-400">
                      🏆 Winner Reward: {selectedGameMode.reward} SOL
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                      💰 Total Cost: {totalCost.toFixed(3)} SOL
                    </div>
                  </div>
                </div>
              )}

              {countdown !== null ? (
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold">Game Starting In</div>
                  <div className="text-3xl font-bold text-primary">{countdown}</div>
                  <Progress value={(5 - countdown) * 20} className="w-full" />
                  <div className="text-xs text-muted-foreground">Total deducted: -{totalCost.toFixed(3)} SOL</div>
                </div>
              ) : (
                <Button
                  onClick={handleFindMatch}
                  disabled={isSearching || !wallet || balance < totalCost}
                  className="w-full"
                  size="lg"
                >
                  {isSearching
                    ? "Finding Match..."
                    : balance < totalCost
                      ? "Insufficient Balance"
                      : `Stake ${totalCost.toFixed(3)} SOL & Find Match`}
                </Button>
              )}

              {isSearching && (
                <div className="text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <div className="text-sm text-muted-foreground">Processing transaction on Gorbagana...</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Network Stats */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Live Network Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-green-500">Gorbagana Testnet</span>
              </div>
              <div className="flex justify-between">
                <span>TPS:</span>
                <span className="text-blue-500">{networkStats.tps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Latency:</span>
                <span className="text-purple-500">{networkStats.avgLatency}ms</span>
              </div>
              <div className="flex justify-between">
                <span>Active Games:</span>
                <span className="text-orange-500">{networkStats.activeGames}</span>
              </div>
              <div className="flex justify-between">
                <span>Daily Volume:</span>
                <span className="text-yellow-500">{networkStats.dailyVolume.toFixed(1)} SOL</span>
              </div>
            </CardContent>
          </Card>

          {/* Player Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Your Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Level:</span>
                <span className="font-semibold">{playerStats.level}</span>
              </div>
              <div className="flex justify-between">
                <span>Games Played:</span>
                <span>{playerStats.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span>
                  {playerStats.gamesPlayed > 0
                    ? ((playerStats.totalWins / playerStats.gamesPlayed) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between">
                <span>Current Streak:</span>
                <span className="text-green-500">{playerStats.currentStreak}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Earnings:</span>
                <span className="text-yellow-500">{playerStats.totalEarnings.toFixed(3)} SOL</span>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Fair Play:</strong> All games use Gorbagana's zero-MEV execution for completely fair competition!
              🎮⚡
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
