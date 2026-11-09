// Tiny pixel-art "SM" mark: the site's only pixel accent.
const PIXELS = [
  // S
  [0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [0, 4], [1, 4], [2, 4],
  // M
  [4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [5, 1], [6, 2], [7, 1], [8, 0], [8, 1], [8, 2], [8, 3], [8, 4],
]

export function PixelMark({ className = '', size = 18 }) {
  return (
    <svg
      viewBox="-1 -1 11 7"
      width={size * (11 / 7)}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {PIXELS.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  )
}
