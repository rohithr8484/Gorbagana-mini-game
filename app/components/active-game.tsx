"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import type { Connection, PublicKey } from "@solana/web3.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Target, Clock, Trophy, Users, Coins, CheckCircle } from "lucide-react"

interface ActiveGameProps {
  onGameEnd: () => void
  wallet: PublicKey | null
  connection: Connection | null
}

interface Player {
  id: string
  name: string
  score: number
  isYou: boolean
}

export default function ActiveGame({ onGameEnd, wallet, connection }: ActiveGameProps) {
  const [gameTime, setGameTime] = useState(30)
  const [score, setScore] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 })
  const [showTarget, setShowTarget] = useState(true)
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "You", score: 0, isYou: true },
    { id: "2", name: "ClickMaster", score: 0, isYou: false },
    { id: "3", name: "SpeedDemon", score: 0, isYou: false },
  ])
  const [gameMode] = useState("speed-click")
  const [entryFeeDeducted] = useState(0.01)
  const [potentialReward] = useState(0.05)
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null)

  // Update player score in real-time
  useEffect(() => {
    setPlayers((prev) => prev.map((player) => (player.isYou ? { ...player, score } : player)))
  }, [score])

  // Simulate other players' scores
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameActive) {
        setPlayers((prev) =>
          prev.map((player) =>
            !player.isYou ? { ...player, score: player.score + Math.floor(Math.random() * 3) } : player,
          ),
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameActive])

  // Game timer
  useEffect(() => {
    if (gameTime > 0 && gameActive) {
      const timer = setTimeout(() => setGameTime(gameTime - 1), 1000)
      return () => clearTimeout(timer)
    } else if (gameTime === 0) {
      setGameActive(false)

      // Determine game result
      const finalPlayers = [...players].sort((a, b) => b.score - a.score)
      const yourRank = finalPlayers.findIndex((p) => p.isYou) + 1
      setGameResult(yourRank === 1 ? "won" : "lost")

      setTimeout(onGameEnd, 3000)
    }
  }, [gameTime, gameActive, onGameEnd, players])

  // Move target for precision mode
  useEffect(() => {
    if (gameMode === "precision-click" && gameActive) {
      const interval = setInterval(() => {
        setTargetPosition({
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
        })
        setShowTarget(true)
        setTimeout(() => setShowTarget(false), 800)
      }, 1500)

      return () => clearInterval(interval)
    }
  }, [gameMode, gameActive])

  const handleClick = useCallback(() => {
    if (!gameActive) return

    setClicks((prev) => prev + 1)
    setScore((prev) => prev + 1)

    // Add visual feedback
    const clickEffect = document.createElement("div")
    clickEffect.className = "absolute pointer-events-none text-primary font-bold animate-ping"
    clickEffect.textContent = "+1"
    clickEffect.style.left = Math.random() * 100 + "%"
    clickEffect.style.top = Math.random() * 100 + "%"
    document.body.appendChild(clickEffect)
    setTimeout(() => document.body.removeChild(clickEffect), 1000)
  }, [gameActive])

  const handleTargetClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!gameActive || !showTarget) return

      setScore((prev) => prev + 5)
      setShowTarget(false)

      // Visual feedback for target hit
      const targetEffect = document.createElement("div")
      targetEffect.className = "absolute pointer-events-none text-green-500 font-bold text-xl animate-bounce"
      targetEffect.textContent = "+5"
      targetEffect.style.left = targetPosition.x + "%"
      targetEffect.style.top = targetPosition.y + "%"
      document.body.appendChild(targetEffect)
      setTimeout(() => document.body.removeChild(targetEffect), 1000)
    },
    [gameActive, showTarget, targetPosition],
  )

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const yourRank = sortedPlayers.findIndex((p) => p.isYou) + 1

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Token Transaction Status */}
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>✅ Entry fee of {entryFeeDeducted} SOL deducted from Backpack wallet via Gorbagana testnet</span>
          <Badge variant="secondary">Transaction Confirmed</Badge>
        </AlertDescription>
      </Alert>

      {/* Game Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Speed Click Challenge</h1>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {gameTime}s
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3" />
            {score} points
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Rank #{yourRank}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            Prize: {potentialReward} SOL
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-3">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Click Zone
                </CardTitle>
                <div className="text-right">
                  <div className="text-2xl font-bold">{score}</div>
                  <div className="text-sm text-muted-foreground">Score</div>
                </div>
              </div>
              <Progress value={((30 - gameTime) / 30) * 100} className="w-full" />
            </CardHeader>
            <CardContent>
              <div
                className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border-2 border-dashed border-primary/20 cursor-pointer select-none overflow-hidden"
                onClick={handleClick}
              >
                {gameActive ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Zap className="w-12 h-12 mx-auto text-primary animate-pulse" />
                      <div className="text-lg font-semibold">Click Anywhere!</div>
                      <div className="text-sm text-muted-foreground">
                        Clicks: {clicks} | CPS: {(clicks / (30 - gameTime) || 0).toFixed(1)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      {gameResult === "won" ? (
                        <>
                          <Trophy className="w-12 h-12 mx-auto text-yellow-500" />
                          <div className="text-lg font-semibold text-green-600">🎉 You Won!</div>
                          <div className="text-sm text-muted-foreground">Final Score: {score} points</div>
                          <div className="text-sm text-green-600">+{potentialReward} SOL reward incoming!</div>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-12 h-12 mx-auto text-gray-400" />
                          <div className="text-lg font-semibold">Game Over!</div>
                          <div className="text-sm text-muted-foreground">Final Score: {score} points</div>
                          <div className="text-sm text-muted-foreground">Rank #{yourRank} - Better luck next time!</div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Moving target for precision mode */}
                {gameMode === "precision-click" && showTarget && gameActive && (
                  <div
                    className="absolute w-12 h-12 bg-red-500 rounded-full cursor-pointer animate-pulse flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%` }}
                    onClick={handleTargetClick}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </div>
                )}

                {/* Click effects container */}
                <div className="absolute inset-0 pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Leaderboard */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Live Rankings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    player.isYou ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0
                          ? "bg-yellow-500 text-white"
                          : index === 1
                            ? "bg-gray-400 text-white"
                            : index === 2
                              ? "bg-amber-600 text-white"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className={`text-sm ${player.isYou ? "font-semibold" : ""}`}>{player.name}</span>
                  </div>
                  <span className="font-mono text-sm">{player.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Token Rewards */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Token Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Entry Fee Paid:</span>
                <span className="text-red-500 font-mono">-{entryFeeDeducted} SOL</span>
              </div>
              <div className="flex justify-between">
                <span>Winner Prize:</span>
                <span className="text-green-500 font-mono">{potentialReward} SOL</span>
              </div>
              <div className="flex justify-between">
                <span>Your Position:</span>
                <span className="font-mono">#{yourRank}</span>
              </div>
              <div className="flex justify-between">
                <span>Potential Profit:</span>
                <span className={`font-mono ${yourRank === 1 ? "text-green-500" : "text-red-500"}`}>
                  {yourRank === 1 ? `+${(potentialReward - entryFeeDeducted).toFixed(3)}` : `-${entryFeeDeducted}`} SOL
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Game Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Your Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Total Clicks:</span>
                <span className="font-mono">{clicks}</span>
              </div>
              <div className="flex justify-between">
                <span>Clicks/Second:</span>
                <span className="font-mono">{(clicks / (30 - gameTime) || 0).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Rank:</span>
                <span className="font-mono">#{yourRank}</span>
              </div>
              <div className="flex justify-between">
                <span>Time Left:</span>
                <span className="font-mono">{gameTime}s</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
