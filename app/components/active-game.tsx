"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import type { Connection, PublicKey } from "@solana/web3.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Zap, Target, Clock, Trophy, Users, Coins, CheckCircle, Flame, Shield } from "lucide-react"

interface ActiveGameProps {
  onGameEnd: () => void
  wallet: PublicKey | null
  connection: Connection | null
  playerStats: {
    gamesPlayed: number
    totalWins: number
    totalEarnings: number
    highestScore: number
    currentStreak: number
    level: number
    xp: number
  }
  onStatsUpdate: (stats: any) => void
}

interface Player {
  id: string
  name: string
  score: number
  isYou: boolean
  powerUps: string[]
}

export default function ActiveGame({ onGameEnd, wallet, connection, playerStats, onStatsUpdate }: ActiveGameProps) {
  const [gameTime, setGameTime] = useState(30)
  const [score, setScore] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 })
  const [showTarget, setShowTarget] = useState(true)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [activePowerUps, setActivePowerUps] = useState<{ [key: string]: number }>({})
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "You", score: 0, isYou: true, powerUps: ["double-click"] },
    { id: "2", name: "ClickMaster", score: 0, isYou: false, powerUps: ["precision-mode"] },
    { id: "3", name: "SpeedDemon", score: 0, isYou: false, powerUps: [] },
  ])
  const [gameMode] = useState("speed-click")
  const [entryFeeDeducted] = useState(0.015) // Including power-ups
  const [potentialReward] = useState(0.05)
  const [gameResult, setGameResult] = useState<"won" | "lost" | null>(null)
  const [showPowerUpEffect, setShowPowerUpEffect] = useState<string | null>(null)

  // Update player score in real-time
  useEffect(() => {
    setPlayers((prev) => prev.map((player) => (player.isYou ? { ...player, score } : player)))
  }, [score])

  // Simulate other players' scores with more realistic AI
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameActive) {
        setPlayers((prev) =>
          prev.map((player) => {
            if (!player.isYou) {
              // More intelligent AI that responds to your performance
              const baseIncrease = Math.floor(Math.random() * 4)
              const catchUpBonus = score > player.score ? Math.floor(Math.random() * 2) : 0
              const powerUpBonus = player.powerUps.length > 0 ? Math.floor(Math.random() * 2) : 0
              return { ...player, score: player.score + baseIncrease + catchUpBonus + powerUpBonus }
            }
            return player
          }),
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [gameActive, score])

  // Game timer
  useEffect(() => {
    if (gameTime > 0 && gameActive) {
      const timer = setTimeout(() => setGameTime(gameTime - 1), 1000)
      return () => clearTimeout(timer)
    } else if (gameTime === 0) {
      setGameActive(false)

      // Determine game result and update stats
      const finalPlayers = [...players].sort((a, b) => b.score - a.score)
      const yourRank = finalPlayers.findIndex((p) => p.isYou) + 1
      const won = yourRank === 1
      setGameResult(won ? "won" : "lost")

      // Update player stats
      const newStats = {
        ...playerStats,
        gamesPlayed: playerStats.gamesPlayed + 1,
        totalWins: won ? playerStats.totalWins + 1 : playerStats.totalWins,
        totalEarnings: won ? playerStats.totalEarnings + potentialReward : playerStats.totalEarnings,
        highestScore: Math.max(playerStats.highestScore, score),
        currentStreak: won ? playerStats.currentStreak + 1 : 0,
        xp: playerStats.xp + (won ? 100 : 50) + Math.floor(score / 10),
      }

      // Level up logic
      const xpForNextLevel = newStats.level * 1000
      if (newStats.xp >= xpForNextLevel) {
        newStats.level += 1
        newStats.xp -= xpForNextLevel
      }

      onStatsUpdate(newStats)

      // Save to localStorage
      if (wallet) {
        localStorage.setItem(`gorbagana_stats_${wallet.toString()}`, JSON.stringify(newStats))
      }

      setTimeout(onGameEnd, 3000)
    }
  }, [gameTime, gameActive, onGameEnd, players, score, playerStats, onStatsUpdate, wallet, potentialReward])

  // Power-up effects
  useEffect(() => {
    const powerUpInterval = setInterval(() => {
      setActivePowerUps((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((key) => {
          updated[key] -= 1
          if (updated[key] <= 0) {
            delete updated[key]
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(powerUpInterval)
  }, [])

  // Combo system
  useEffect(() => {
    if (combo > maxCombo) {
      setMaxCombo(combo)
    }

    // Combo decay
    const comboTimer = setTimeout(() => {
      if (combo > 0) {
        setCombo(Math.max(0, combo - 1))
      }
    }, 2000)

    return () => clearTimeout(comboTimer)
  }, [combo, maxCombo])

  const activatePowerUp = (powerUpId: string) => {
    setActivePowerUps((prev) => ({ ...prev, [powerUpId]: 10 }))
    setShowPowerUpEffect(powerUpId)
    setTimeout(() => setShowPowerUpEffect(null), 2000)
  }

  const handleClick = useCallback(() => {
    if (!gameActive) return

    setClicks((prev) => prev + 1)
    setCombo((prev) => prev + 1)

    let points = 1

    // Double click power-up
    if (activePowerUps["double-click"]) {
      points *= 2
    }

    // Combo multiplier
    if (combo > 5) {
      points *= Math.floor(combo / 5) + 1
    }

    // Precision mode bonus (random chance)
    if (activePowerUps["precision-mode"] && Math.random() > 0.7) {
      points *= 2
    }

    setScore((prev) => prev + points)

    // Visual feedback
    const clickEffect = document.createElement("div")
    clickEffect.className = "absolute pointer-events-none text-primary font-bold animate-ping z-50"
    clickEffect.textContent = `+${points}`
    clickEffect.style.left = Math.random() * 80 + 10 + "%"
    clickEffect.style.top = Math.random() * 80 + 10 + "%"
    clickEffect.style.fontSize = points > 1 ? "18px" : "14px"
    clickEffect.style.color = points > 1 ? "#10b981" : "#3b82f6"
    document.body.appendChild(clickEffect)
    setTimeout(() => {
      if (document.body.contains(clickEffect)) {
        document.body.removeChild(clickEffect)
      }
    }, 1000)
  }, [gameActive, activePowerUps, combo])

  const handleTargetClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      if (!gameActive || !showTarget) return

      let points = 5
      if (activePowerUps["precision-mode"]) {
        points *= 2
      }

      setScore((prev) => prev + points)
      setCombo((prev) => prev + 2)
      setShowTarget(false)

      // Visual feedback for target hit
      const targetEffect = document.createElement("div")
      targetEffect.className = "absolute pointer-events-none text-green-500 font-bold text-xl animate-bounce z-50"
      targetEffect.textContent = `+${points}`
      targetEffect.style.left = targetPosition.x + "%"
      targetEffect.style.top = targetPosition.y + "%"
      document.body.appendChild(targetEffect)
      setTimeout(() => {
        if (document.body.contains(targetEffect)) {
          document.body.removeChild(targetEffect)
        }
      }, 1000)
    },
    [gameActive, showTarget, targetPosition, activePowerUps],
  )

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score)
  const yourRank = sortedPlayers.findIndex((p) => p.isYou) + 1

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Enhanced Transaction Status */}
      <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            ✅ Entry fee of {entryFeeDeducted} SOL deducted • Transaction confirmed in{" "}
            {Math.floor(Math.random() * 100) + 50}ms
          </span>
          <Badge variant="secondary">Gorbagana Speed</Badge>
        </AlertDescription>
      </Alert>

      {/* Enhanced Game Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Speed Click Championship</h1>
        <div className="flex items-center justify-center gap-4 flex-wrap">
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
          {combo > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {combo}x Combo
            </Badge>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Enhanced Game Area */}
        <div className="lg:col-span-3">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Click Zone
                  {showPowerUpEffect && (
                    <Badge variant="outline" className="animate-pulse">
                      {showPowerUpEffect} Active!
                    </Badge>
                  )}
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
                      {combo > 0 && (
                        <div className="text-lg font-bold text-red-500 animate-bounce">{combo}x COMBO!</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      {gameResult === "won" ? (
                        <>
                          <Trophy className="w-12 h-12 mx-auto text-yellow-500" />
                          <div className="text-lg font-semibold text-green-600">🎉 Victory!</div>
                          <div className="text-sm text-muted-foreground">Final Score: {score} points</div>
                          <div className="text-sm text-green-600">+{potentialReward} SOL earned!</div>
                          <div className="text-xs text-muted-foreground">Max Combo: {maxCombo}x</div>
                        </>
                      ) : (
                        <>
                          <Trophy className="w-12 h-12 mx-auto text-gray-400" />
                          <div className="text-lg font-semibold">Game Over!</div>
                          <div className="text-sm text-muted-foreground">Final Score: {score} points</div>
                          <div className="text-sm text-muted-foreground">Rank #{yourRank} - Great effort!</div>
                          <div className="text-xs text-muted-foreground">Max Combo: {maxCombo}x</div>
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

                {/* Power-up activation buttons */}
                {gameActive && (
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => activatePowerUp("double-click")}
                      disabled={!!activePowerUps["double-click"]}
                      className="bg-yellow-500 hover:bg-yellow-600"
                    >
                      <Zap className="w-4 h-4" />
                      {activePowerUps["double-click"] ? `${activePowerUps["double-click"]}s` : "2x"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => activatePowerUp("precision-mode")}
                      disabled={!!activePowerUps["precision-mode"]}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Target className="w-4 h-4" />
                      {activePowerUps["precision-mode"] ? `${activePowerUps["precision-mode"]}s` : "Aim"}
                    </Button>
                  </div>
                )}

                {/* Click effects container */}
                <div className="absolute inset-0 pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-4">
          {/* Live Leaderboard */}
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
                    <div>
                      <span className={`text-sm ${player.isYou ? "font-semibold" : ""}`}>{player.name}</span>
                      {player.powerUps.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {player.powerUps.map((powerUp, i) => (
                            <div key={i} className="w-3 h-3 bg-orange-500 rounded-full" title={powerUp} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-sm">{player.score}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Token Rewards */}
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Coins className="w-4 h-4" />
                Token Economics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Entry + Power-ups:</span>
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
              <div className="flex justify-between">
                <span>XP Earned:</span>
                <span className="text-blue-500 font-mono">
                  +{(yourRank === 1 ? 100 : 50) + Math.floor(score / 10)} XP
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Game Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance Stats</CardTitle>
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
                <span>Max Combo:</span>
                <span className="font-mono text-red-500">{maxCombo}x</span>
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

          {/* Active Power-ups */}
          {Object.keys(activePowerUps).length > 0 && (
            <Card className="border-orange-200 dark:border-orange-800">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  Active Power-ups
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(activePowerUps).map(([powerUp, timeLeft]) => (
                  <div key={powerUp} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      {powerUp === "double-click" && <Zap className="w-3 h-3" />}
                      {powerUp === "precision-mode" && <Target className="w-3 h-3" />}
                      {powerUp === "shield" && <Shield className="w-3 h-3" />}
                      {powerUp.replace("-", " ")}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {timeLeft}s
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
