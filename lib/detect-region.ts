// ponytail: region from localStorage, geolocation to detect
export function getRegion(): 'IN' | 'INTL' {
  if (typeof window === 'undefined') return 'IN'
  return localStorage.getItem('region') === 'INTL' ? 'INTL' : 'IN'
}

// India bounding box (rough): lat 6-36, lng 68-98
function isIndia(lat: number, lng: number): boolean {
  return lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98
}

export function initRegion(): void {
  if (typeof window === 'undefined') return
  if (localStorage.getItem('region')) return // already set

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const region = isIndia(pos.coords.latitude, pos.coords.longitude) ? 'IN' : 'INTL'
      localStorage.setItem('region', region)
      window.location.reload()
    },
    () => {
      // denied or error — default INR
      localStorage.setItem('region', 'IN')
    }
  )
}
