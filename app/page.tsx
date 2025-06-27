"use client"

import { useState, useEffect } from "react"
import { Connection, type PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Zap, Trophy, Users, Clock, Coins, AlertTriangle } from "lucide-react"
import GameLobby from "./components/game-lobby"
import ActiveGame from "./components/active-game"
import Leaderboard from "./components/leaderboard"

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

  useEffect(() => {
    // Initialize Gorbagana testnet connection
    const initializeConnection = async () => {
      try {
        // Replace with actual Gorbagana RPC endpoint when available
        const conn = new Connection("https://api.devnet.solana.com", "confirmed")
        setConnection(conn)

        // Test connection
        await conn.getLatestBlockhash()
        setNetworkStatus("connected")
      } catch (error) {
        console.error("Failed to connect to Gorbagana testnet:", error)
        setNetworkStatus("error")
      }
    }

    initializeConnection()
  }, [])

  useEffect(() => {
    if (wallet && connection) {
      fetchBalance()
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

  const renderGameState = () => {
    switch (gameState) {
      case "lobby":
        return (
          <GameLobby
            onStartGame={() => setGameState("playing")}
            onBack={() => setGameState("menu")}
            wallet={wallet}
            balance={balance}
          />
        )
      case "playing":
        return <ActiveGame onGameEnd={() => setGameState("leaderboard")} wallet={wallet} connection={connection} />
      case "leaderboard":
        return <Leaderboard onBack={() => setGameState("menu")} />
      default:
        return (
          <div className="space-y-8">
            {/* Network Status Alert */}
            <Alert
              className={
                networkStatus === "connected"
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {networkStatus === "connected"
                    ? "✅ Connected to Gorbagana Testnet - Ready for lightning-fast gameplay!"
                    : networkStatus === "connecting"
                      ? "🔄 Connecting to Gorbagana Testnet..."
                      : "❌ Connection error - Using Solana Devnet for demo"}
                </span>
                <Badge variant={networkStatus === "connected" ? "default" : "secondary"}>
                  {networkStatus === "connected" ? "LIVE" : "DEMO"}
                </Badge>
              </AlertDescription>
            </Alert>

            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Zap className="w-8 h-8 text-yellow-500" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Gorbagana Speed Clicker
                </h1>
                <Zap className="w-8 h-8 text-yellow-500" />
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The fastest multiplayer clicking game on Gorbagana testnet. Compete with test tokens, earn rewards, and
                experience zero-MEV gaming!
              </p>
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
              </div>
            </div>

            {/* Backpack Wallet Connection */}
            <Card className="max-w-md mx-auto border-2 border-purple-200 dark:border-purple-800">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Wallet className="w-5 h-5" />
                  Backpack Wallet Required
                </CardTitle>
                <CardDescription>Connect your Backpack wallet to play with Gorbagana test tokens</CardDescription>
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
                    <div className="grid grid-cols-2 gap-2">
                      <Button onClick={() => setGameState("lobby")} className="flex-1">
                        Play Game
                      </Button>
                      <Button onClick={() => setGameState("leaderboard")} variant="outline" className="flex-1">
                        <Trophy className="w-4 h-4 mr-1" />
                        Leaderboard
                      </Button>
                    </div>
                    <Button onClick={disconnectWallet} variant="ghost" size="sm" className="w-full">
                      Disconnect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Test Token Integration Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-green-500" />
                    Test Token Entry Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Pay small entry fees (0.01-0.03 SOL) using Gorbagana test tokens to join competitive matches.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Token Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Win test tokens (0.05-0.12 SOL) for top performances. All rewards are distributed instantly!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Instant Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Experience Web2-like speed with instant token transfers on Gorbagana's zero-MEV testnet.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Game Modes with Token Economics */}
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Game Modes & Token Economics
                </CardTitle>
                <CardDescription>All games use Gorbagana test tokens for entry fees and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-semibold">Speed Click</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">30-second clicking frenzy</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Entry Fee:</span>
                        <span className="text-red-500">0.01 SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Winner Reward:</span>
                        <span className="text-green-500">0.05 SOL</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <h3 className="font-semibold">Precision Click</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Hit moving targets accurately</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Entry Fee:</span>
                        <span className="text-red-500">0.02 SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Winner Reward:</span>
                        <span className="text-green-500">0.08 SOL</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <h3 className="font-semibold">Endurance Click</h3>
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
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
