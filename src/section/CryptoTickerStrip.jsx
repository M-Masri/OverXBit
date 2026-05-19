import { useEffect, useMemo, useState } from 'react'

const trackedCoins = [
  'bitcoin',
  'ethereum',
  'solana',
  'xrp',
  'dogecoin',
  'cardano',
  'toncoin',
  'avalanche-2',
  'polkadot',
  'chainlink',
  'cronos',
  'bittensor',
  'pi-network',
  'ondo-finance',
]

function formatPrice(value) {
  if (value >= 1000) return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (value >= 1) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  if (value >= 0.01) return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 })}`
}

function CryptoTickerStrip() {
  const [coins, setCoins] = useState([])
  const [isCompactViewport, setIsCompactViewport] = useState(false)

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

        if (!response.ok) throw new Error('Failed to fetch market data')

        const data = await response.json()
        setCoins(Array.isArray(data) ? data : [])
      } catch (error) {
        if (error.name !== 'AbortError') setCoins([])
      }
    }

    loadCoins()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1024px)')

    const syncViewport = () => {
      setIsCompactViewport(media.matches)
    }

    syncViewport()
    media.addEventListener('change', syncViewport)

    return () => {
      media.removeEventListener('change', syncViewport)
    }
  }, [])

  const marqueeItems = useMemo(() => {
    const topCoins = coins.filter((_, index) => index % 2 === 0)
    const source = topCoins.length ? topCoins : coins
    return source.length ? [...source, ...source, ...source] : []
  }, [coins])

  const bottomMarqueeItems = useMemo(() => {
    const bottomCoins = coins.filter((_, index) => index % 2 === 1)
    const source = bottomCoins.length ? bottomCoins : coins
    return source.length ? [...source, ...source, ...source] : []
  }, [coins])

  const renderCoinItem = (coin, index, row) => {
    const change = coin.price_change_percentage_24h ?? 0
    const isUp = change >= 0

    return (
      <a
        key={`${row}-${coin.id}-${index}`}
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
  }

  return (
    <section
      className="market-scroll-section"
      aria-label="Live crypto market ticker"
      style={{
        width: '100vw',
        maxWidth: 'none',
        position: 'relative',
        marginInline: 'calc(50% - 50vw)',
        marginTop: isCompactViewport ? '-1.6rem' : '-4rem',
        paddingTop: 0,
      }}
    >
      <div
        className="market-strip-section"
        style={{
          maxWidth: '1400px',
          width: '100%',
          borderTop: 'none',
        }}
      >
        <div className="market-strip-tilt" style={{ borderTop: 'none' }}>
          <div className="market-strip-overlay" />

          <div className="market-strip-inner" style={{ borderTop: 'none' }}>
            <h3 className="market-strip-title">Live Crypto <span style={{color: '#70A9DC'}}>Market</span></h3>

            <div className="market-marquee-stack" role="presentation">
              <div className="market-marquee">
                <div className="market-marquee-track">
                  {marqueeItems.length > 0 ? marqueeItems.map((coin, index) => renderCoinItem(coin, index, 'top')) : null}
                </div>
              </div>

              <div className="market-marquee market-marquee-secondary">
                <div className="market-marquee-track is-reverse">
                  {bottomMarqueeItems.length > 0 ? bottomMarqueeItems.map((coin, index) => renderCoinItem(coin, index, 'bottom')) : null}
                </div>
              </div>
            </div>

            {marqueeItems.length === 0 ? <p className="market-loading">Loading live market prices...</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CryptoTickerStrip