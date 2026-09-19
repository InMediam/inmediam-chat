import { cn } from '@inmediam/ui'

type LoadingSpinProps = React.SVGProps<SVGSVGElement>

export function LoadingSpin({ ...rest }: LoadingSpinProps) {
  return (
    <svg
      {...rest}
      width={rest.width || '20'}
      height={rest.height || '20'}
      viewBox="0 0 20 20"
      className={cn(
        'mr-2 animate-spin data-[pending=false]:hidden',
        rest.className,
      )}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Line"
        d="M18.75 10C18.75 11.1491 18.5237 12.2869 18.0839 13.3485C17.6442 14.4101 16.9997 15.3747 16.1872 16.1872C15.3747 16.9997 14.4101 17.6442 13.3485 18.0839C12.2869 18.5237 11.1491 18.75 10 18.75C8.85093 18.75 7.71312 18.5237 6.65152 18.0839C5.58992 17.6442 4.62533 16.9997 3.81281 16.1872C3.0003 15.3747 2.35578 14.4101 1.91605 13.3485C1.47632 12.2869 1.25 11.1491 1.25 10C1.25 8.85093 1.47633 7.71312 1.91606 6.65152C2.35578 5.58992 3.00031 4.62533 3.81282 3.81281C4.62533 3.0003 5.58992 2.35578 6.65152 1.91605C7.71312 1.47632 8.85094 1.25 10 1.25C11.1491 1.25 12.2869 1.47633 13.3485 1.91606C14.4101 2.35579 15.3747 3.00031 16.1872 3.81282C16.9997 4.62533 17.6442 5.58993 18.0839 6.65152C18.5237 7.71312 18.75 8.85094 18.75 10L18.75 10Z"
        stroke="#CA8504"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.06 5"
        style={{
          animation: 'fadeOpacity 1s infinite',
        }}
      />
      <style>
        {`
          @keyframes fadeOpacity {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </svg>
  )
}
