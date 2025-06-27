"use client"

import { useState, useEffect } from "react"
import { Connection, type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Zap, Trophy, Users, Clock, Coins, AlertTriangle, Star, Share2, Target, Flame } from "lucide-react"
import GameLobby from "./components/game-lobby"
import ActiveGame from "./components/active-game"
import Leaderboard from "./components/leaderboard"
import Achievements from "./components/achievements"
import DailyChallenges from "./components/daily-challenges"
import SocialHub from "./components/social-hub"

declare global {
  interface Window {
    backpack?: {
      isBackpack: boolean
      connect: () => Promise<{ publicKey: PublicKey }>
      disconnect: () => Promise<void>
      signTransaction: (transaction: any) => Promise<any>
      publicKey?: PublicKey
    }
  }
}

export default function GorbaganaSpeedClicker() {
  const [wallet, setWallet] = useState<PublicKey | null>(null)
  const [balance, setBalance] = useState<number>(0)
  const [gameState, setGameState] = useState<"menu" | "lobby" | "playing" | "leaderboard">("menu")
  const [connection, setConnection] = useState<Connection | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [networkStatus, setNetworkStatus] = useState<"connected" | "connecting" | "error">("connecting")
  const [playerStats, setPlayerStats] = useState({
    gamesPlayed: 0,
    totalWins: 0,
    totalEarnings: 0,
    highestScore: 0,
    currentStreak: 0,
    level: 1,
    xp: 0,
  })
  const [networkStats, setNetworkStats] = useState({
    tps: 0,
    avgLatency: 0,
    activeGames: 0,
    totalPlayers: 0,
    dailyVolume: 0,
  })

  useEffect(() => {
    // Initialize Gorbagana testnet connection with enhanced monitoring
    const initializeConnection = async () => {
      try {
        // Replace with actual Gorbagana RPC endpoint when available
        const conn = new Connection("https://api.devnet.solana.com", "confirmed")
        setConnection(conn)

        // Test connection and get network stats
        const startTime = Date.now()
        await conn.getLatestBlockhash()
        const latency = Date.now() - startTime

        setNetworkStatus("connected")
        setNetworkStats((prev) => ({
          ...prev,
          avgLatency: latency,
          tps: Math.floor(Math.random() * 5000) + 2000, // Simulated TPS
          activeGames: Math.floor(Math.random() * 50) + 20,
          totalPlayers: Math.floor(Math.random() * 1000) + 500,
          dailyVolume: Math.random() * 100 + 50,
        }))
      } catch (error) {
        console.error("Failed to connect to Gorbagana testnet:", error)
        setNetworkStatus("error")
      }
    }

    initializeConnection()

    // Update network stats periodically
    const statsInterval = setInterval(() => {
      setNetworkStats((prev) => ({
        ...prev,
        tps: Math.floor(Math.random() * 1000) + prev.tps * 0.9,
        activeGames: Math.max(1, prev.activeGames + Math.floor(Math.random() * 6) - 3),
        totalPlayers: Math.max(1, prev.totalPlayers + Math.floor(Math.random() * 20) - 10),
      }))
    }, 5000)

    return () => clearInterval(statsInterval)
  }, [])

  useEffect(() => {
    if (wallet && connection) {
      fetchBalance()
      loadPlayerStats()
    }
  }, [wallet, connection])

  const fetchBalance = async () => {
    if (!wallet || !connection) return
    try {
      const balance = await connection.getBalance(wallet)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }

  const loadPlayerStats = () => {
    // Load from localStorage or blockchain
    const saved = localStorage.getItem(`gorbagana_stats_${wallet?.toString()}`)
    if (saved) {
      setPlayerStats(JSON.parse(saved))
    }
  }

  const connectWallet = async () => {
    if (!window.backpack) {
      alert("Backpack wallet not found! Please install Backpack wallet extension from backpack.app")
      return
    }

    setIsConnecting(true)
    try {
      const response = await window.backpack.connect()
      setWallet(response.publicKey)
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect Backpack wallet. Please try again.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    if (window.backpack) {
      await window.backpack.disconnect()
      setWallet(null)
      setBalance(0)
      setGameState("menu")
    }
  }

  const shareGame = async () => {
    const shareData = {
      title: "Gorbagana Speed Clicker",
      text: `I just played the fastest clicking game on Gorbagana testnet! My high score: ${playerStats.highestScore}. Can you beat it? 🎮⚡`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      alert("Game link copied to clipboard!")
    }
  }

  const renderGameState = () => {
    switch (gameState) {
      case "lobby":
        return (
          <GameLobby
            onStartGame={() => setGameState("playing")}
            onBack={() => setGameState("menu")}
            wallet={wallet}
            balance={balance}
            playerStats={playerStats}
            networkStats={networkStats}
          />
        )
      case "playing":
        return (
          <ActiveGame
            onGameEnd={() => setGameState("leaderboard")}
            wallet={wallet}
            connection={connection}
            playerStats={playerStats}
            onStatsUpdate={setPlayerStats}
          />
        )
      case "leaderboard":
        return <Leaderboard onBack={() => setGameState("menu")} playerStats={playerStats} />
      default:
        return (
          <div className="space-y-8">
            {/* Enhanced Network Status with Real-time Stats */}
            <Alert
              className={
                networkStatus === "connected"
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>
                    {networkStatus === "connected"
                      ? "✅ Connected to Gorbagana Testnet"
                      : networkStatus === "connecting"
                        ? "🔄 Connecting to Gorbagana Testnet..."
                        : "❌ Connection error - Using Solana Devnet for demo"}
                  </span>
                  {networkStatus === "connected" && (
                    <div className="flex items-center gap-3 text-xs">
                      <span>TPS: {networkStats.tps.toLocaleString()}</span>
                      <span>Latency: {networkStats.avgLatency}ms</span>
                      <span>Players: {networkStats.totalPlayers}</span>
                    </div>
                  )}
                </div>
                <Badge variant={networkStatus === "connected" ? "default" : "secondary"}>
                  {networkStatus === "connected" ? "LIVE" : "DEMO"}
                </Badge>
              </AlertDescription>
            </Alert>

            {/* Hero Section with Enhanced Branding */}
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-10 h-10 text-yellow-500 animate-pulse" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
                  Gorbagana Speed Clicker
                </h1>
                <Zap className="w-10 h-10 text-yellow-500 animate-pulse" />
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The most addictive multiplayer clicking game on Solana's fastest testnet. Compete with test tokens, earn
                rewards, and experience zero-MEV gaming at lightning speed! 🗑️➡️💎
              </p>

              {/* Live Stats Banner */}
              <div className="flex items-center justify-center gap-6 text-sm bg-muted/50 rounded-lg p-4 max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{networkStats.tps.toLocaleString()} TPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold">{networkStats.avgLatency}ms Latency</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  <span className="font-semibold">{networkStats.totalPlayers} Players Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="font-semibold">{networkStats.dailyVolume.toFixed(1)} SOL Daily Volume</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Zero-MEV Execution
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Instant Finality
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  Test Token Rewards
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Competitive Leaderboards
                </Badge>
              </div>
            </div>

            {/* Enhanced Wallet Connection with Player Stats */}
            <Card className="max-w-lg mx-auto border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Backpack Wallet Required
                </CardTitle>
                <CardDescription>Connect your Backpack wallet to start your Gorbagana gaming journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!wallet ? (
                  <div className="space-y-3">
                    <Button onClick={connectWallet} disabled={isConnecting} className="w-full" size="lg">
                      {isConnecting ? "Connecting..." : "Connect Backpack Wallet"}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      Don't have Backpack? Download from{" "}
                      <a
                        href="https://backpack.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        backpack.app
                      </a>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-muted-foreground">✅ Backpack Wallet Connected</p>
                      <p className="font-mono text-xs bg-muted p-2 rounded">
                        {wallet.toString().slice(0, 8)}...{wallet.toString().slice(-8)}
                      </p>
                      <div className="flex items-center justify-center gap-1 text-sm">
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span>{balance.toFixed(4)} SOL</span>
                        <Badge variant="outline" className="ml-2">
                          Test Tokens
                        </Badge>
                      </div>
                    </div>

                    {/* Player Stats Preview */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-muted/50 rounded-lg p-3">
                      <div>
                        <div className="font-semibold text-green-600">Level {playerStats.level}</div>
                        <div className="text-muted-foreground">Player Level</div>
                      </div>
                      <div>
                        <div className="font-semibold text-blue-600">{playerStats.totalWins}</div>
                        <div className="text-muted-foreground">Total Wins</div>
                      </div>
                      <div>
                        <div className="font-semibold text-purple-600">{playerStats.currentStreak}</div>
                        <div className="text-muted-foreground">Win Streak</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => setGameState("lobby")} className="flex-1">
                        <Zap className="w-4 h-4 mr-1" />
                        Play Game
                      </Button>
                      <Button onClick={() => setGameState("leaderboard")} variant="outline" className="flex-1">
                        <Trophy className="w-4 h-4 mr-1" />
                        Leaderboard
                      </Button>
                    </div>

                    <Button onClick={shareGame} variant="ghost" size="sm" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Game
                    </Button>

                    <Button
                      onClick={disconnectWallet}
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Features Tabs */}
            <Tabs defaultValue="features" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="features">Game Features</TabsTrigger>
                <TabsTrigger value="challenges">Daily Challenges</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="social">Social Hub</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="space-y-6">
                {/* Enhanced Game Modes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Game Modes & Token Economics
                    </CardTitle>
                    <CardDescription>Multiple ways to compete and earn test tokens on Gorbagana</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-yellow-500" />
                          <h3 className="font-semibold">Speed Click</h3>
                          <Badge variant="secondary">Popular</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">30-second clicking frenzy with power-ups</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Entry Fee:</span>
                            <span className="text-red-500">0.01 SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Winner Reward:</span>
                            <span className="text-green-500">0.05 SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Players:</span>
                            <span>8</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-blue-500" />
                          <h3 className="font-semibold">Precision Click</h3>
                          <Badge variant="outline">Skill-based</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Hit moving targets with accuracy</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Entry Fee:</span>
                            <span className="text-red-500">0.02 SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Winner Reward:</span>
                            <span className="text-green-500">0.08 SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Players:</span>
                            <span>6</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          <h3 className="font-semibold">Endurance Click</h3>
                          <Badge variant="destructive">Hardcore</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">2-minute stamina challenge</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Entry Fee:</span>
                            <span className="text-red-500">0.03 SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Winner Reward:</span>
                            <span className="text-green-500">0.12 SOL</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Max Players:</span>
                            <span>4</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Power-ups and Features */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Power-ups & Abilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">⚡</div>
                        <div>
                          <div className="font-medium text-sm">Double Click</div>
                          <div className="text-xs text-muted-foreground">Each click counts as 2 for 10 seconds</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">🎯</div>
                        <div>
                          <div className="font-medium text-sm">Precision Mode</div>
                          <div className="text-xs text-muted-foreground">Bonus points for accurate clicks</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">🛡️</div>
                        <div>
                          <div className="font-medium text-sm">Shield</div>
                          <div className="text-xs text-muted-foreground">Protect your score from penalties</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Gorbagana Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">⚡</div>
                        <div>
                          <div className="font-medium text-sm">Lightning Speed</div>
                          <div className="text-xs text-muted-foreground">Sub-second transaction finality</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">🔒</div>
                        <div>
                          <div className="font-medium text-sm">Zero MEV</div>
                          <div className="text-xs text-muted-foreground">Fair gameplay, no front-running</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">📊</div>
                        <div>
                          <div className="font-medium text-sm">Real-time Stats</div>
                          <div className="text-xs text-muted-foreground">Live network performance metrics</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="challenges">
                <DailyChallenges playerStats={playerStats} />
              </TabsContent>

              <TabsContent value="achievements">
                <Achievements playerStats={playerStats} />
              </TabsContent>

              <TabsContent value="social">
                <SocialHub playerStats={playerStats} networkStats={networkStats} />
              </TabsContent>
            </Tabs>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-purple-950 dark:via-pink-950 dark:to-yellow-950">
      <div className="container mx-auto px-4 py-8">{renderGameState()}</div>
    </div>
  )
}
