import iconImg from '../assets/icon.png'

interface IconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  rounded?: boolean
  shadow?: boolean
  className?: string
}

const sizeMap = {
  sm: 24,
  md: 40,
  lg: 64,
  xl: 120,
}

export function AppIcon({ size = 'md', rounded = true, shadow = false, className = '' }: IconProps) {
  const px = sizeMap[size]
  
  return (
    <div
      className={`app-icon ${rounded ? 'rounded' : ''} ${shadow ? 'shadow' : ''} ${className}`}
      style={{
        width: `${px}px`,
        height: `${px}px`,
      }}
    >
      <img src={iconImg} alt="MyWiki" />
    </div>
  )
}

export default AppIcon
