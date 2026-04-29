import { useEffect, useMemo, useState } from 'react'

const trackedCoins = [
  'bitcoin',
  'ethereum',
  'solana',
  'chainlink',
  'cronos',
  'bittensor',
  'pi-network',
  'ondo-finance',
]

function formatPrice(value) {
  if (value >= 1000) {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  }

  if (value >= 1) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  if (value >= 0.01) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
  }

  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`
}

function CryptoTickerStrip() {
  const [coins, setCoins] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    const loadCoins = async () => {
      try {
        const params = new URLSearchParams({
          vs_currency: 'usd',
          ids: trackedCoins.join(','),
          order: 'market_cap_desc',
          per_page: '20',
          page: '1',
          sparkline: 'false',
          price_change_percentage: '24h',
        })

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }

        const data = await response.json()
        setCoins(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCoins([])
        }
      }
    }

    loadCoins()
    return () => controller.abort()
  }, [])

  const marqueeItems = useMemo(() => {
    if (coins.length === 0) {
      return []
    }

    return [...coins, ...coins]
  }, [coins])

  return (
    <section className="market-strip-section" aria-label="Live crypto market ticker">
      <div className="market-strip-tilt">
        <div className="market-strip-overlay" />
        <div className="market-strip-inner">
          <h3 className="market-strip-title">Live Crypto Market</h3>
          <div className="market-marquee" role="presentation">
            <div className="market-marquee-track">
              {marqueeItems.length > 0 ? (
                marqueeItems.map((coin, index) => {
                  const change = coin.price_change_percentage_24h ?? 0
                  const isUp = change >= 0

                  return (
                    <a
                      key={`${coin.id}-${index}`}
                      href={`https://www.coingecko.com/en/coins/${coin.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="market-item"
                    >
                      <img src={coin.image} alt={coin.name} className="market-item-icon" loading="lazy" />
                      <span className="market-item-name">{coin.name}</span>
                      <span className="market-item-symbol">{coin.symbol?.toUpperCase()}</span>
                      <span className="market-item-price">{formatPrice(coin.current_price ?? 0)}</span>
                      <span className={`market-item-change ${isUp ? 'is-up' : 'is-down'}`}>
                        {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(1)}%
                      </span>
                    </a>
                  )
                })
              ) : (
                <p className="market-loading">Loading live market prices...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CryptoTickerStrip