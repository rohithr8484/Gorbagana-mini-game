"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { PublicKey } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Users, Clock, Zap, Target, Coins, AlertTriangle, Wallet } from "lucide-react"

interface GameLobbyProps {
  onStartGame: () => void
  onBack: () => void
  wallet: PublicKey | null
  balance: number
}

interface GameMode {
  id: string
  name: string
  description: string
  duration: number
  entryFee: number
  reward: number
  icon: React.ReactNode
}

export default function GameLobby({ onStartGame, onBack, wallet, balance }: GameLobbyProps) {
  const [selectedMode, setSelectedMode] = useState<string>("speed-click")
  const [playersInLobby, setPlayersInLobby] = useState<number>(1)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const gameModes: GameMode[] = [
    {
      id: "speed-click",
      name: "Speed Click",
      description: "Click as fast as you can in 30 seconds",
      duration: 30,
      entryFee: 0.01,
      reward: 0.05,
      icon: <Zap className="w-5 h-5" />,
    },
    {
      id: "precision-click",
      name: "Precision Click",
      description: "Hit moving targets with accuracy",
      duration: 60,
      entryFee: 0.02,
      reward: 0.08,
      icon: <Target className="w-5 h-5" />,
    },
    {
      id: "endurance-click",
      name: "Endurance Click",
      description: "Maintain clicking rhythm for 2 minutes",
      duration: 120,
      entryFee: 0.03,
      reward: 0.12,
      icon: <Clock className="w-5 h-5" />,
    },
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

    if (balance < selectedGameMode.entryFee) {
      alert(`Insufficient balance! You need ${selectedGameMode.entryFee} SOL to play this mode.`)
      return
    }

    setIsSearching(true)
    // Simulate matchmaking and token deduction
    setTimeout(() => {
      setIsSearching(false)
      setCountdown(5)
    }, 2000)
  }

  const selectedGameMode = gameModes.find((mode) => mode.id === selectedMode)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Game Lobby</h1>
          <p className="text-muted-foreground">Choose your game mode and stake test tokens</p>
        </div>
      </div>

      {/* Balance Alert */}
      <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950/20">
        <Wallet className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            💰 Your Gorbagana Test Token Balance: <strong>{balance.toFixed(4)} SOL</strong>
          </span>
          <Badge variant="secondary">Backpack Connected</Badge>
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Game Modes */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold">Select Game Mode & Stake Tokens</h2>
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
                  <CardDescription>{mode.description}</CardDescription>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-green-600 dark:text-green-400">🏆 Winner gets: {mode.reward} SOL</div>
                    <div className="text-xs text-muted-foreground">
                      Profit: +{(mode.reward - mode.entryFee).toFixed(3)} SOL
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Lobby Status */}
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
                  <div className="text-sm font-medium">Selected Mode:</div>
                  <div className="bg-muted p-3 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedGameMode.icon}
                      <span className="font-medium">{selectedGameMode.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Duration: {selectedGameMode.duration}s</div>
                    <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                      <Coins className="w-3 h-3" />
                      Entry Fee: {selectedGameMode.entryFee} SOL
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">
                      🏆 Winner Reward: {selectedGameMode.reward} SOL
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">
                      💰 Net Profit: +{(selectedGameMode.reward - selectedGameMode.entryFee).toFixed(3)} SOL
                    </div>
                  </div>
                </div>
              )}

              {countdown !== null ? (
                <div className="text-center space-y-2">
                  <div className="text-lg font-bold">Game Starting In</div>
                  <div className="text-3xl font-bold text-primary">{countdown}</div>
                  <Progress value={(5 - countdown) * 20} className="w-full" />
                  <div className="text-xs text-muted-foreground">
                    Entry fee deducted: -{selectedGameMode?.entryFee} SOL
                  </div>
                </div>
              ) : (
                <Button
                  onClick={handleFindMatch}
                  disabled={isSearching || !wallet || (selectedGameMode && balance < selectedGameMode.entryFee)}
                  className="w-full"
                  size="lg"
                >
                  {isSearching
                    ? "Finding Match..."
                    : selectedGameMode && balance < selectedGameMode.entryFee
                      ? "Insufficient Balance"
                      : "Stake Tokens & Find Match"}
                </Button>
              )}

              {isSearching && (
                <div className="text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <div className="text-sm text-muted-foreground">Processing token transaction on Gorbagana...</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Token Economics */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Token Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="text-green-500">Gorbagana Testnet</span>
              </div>
              <div className="flex justify-between">
                <span>Token Type:</span>
                <span>Native Test SOL</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Speed:</span>
                <span className="text-blue-500">~50ms</span>
              </div>
              <div className="flex justify-between">
                <span>MEV Protection:</span>
                <span className="text-green-500">✅ Zero MEV</span>
              </div>
              <div className="flex justify-between">
                <span>Active Prize Pool:</span>
                <span className="text-yellow-500">{(Math.random() * 5 + 2).toFixed(2)} SOL</span>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Test Tokens Only:</strong> All gameplay uses Gorbagana test tokens. No real value, pure
              competitive fun! 🎮
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
