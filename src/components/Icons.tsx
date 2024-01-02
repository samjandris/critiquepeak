const iconSize = '1.5em';

export function CritiquePeakLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 640 512"
      fill="currentColor"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path d="M560 160c44.2 0 80-35.8 80-80S604.2 0 560 0s-80 35.8-80 80 35.8 80 80 80zM55.9 512h523c33.8 0 61.1-27.4 61.1-61.1 0-11.2-3.1-22.2-8.9-31.8l-132-216.3C495 196.1 487.8 192 480 192s-15 4.1-19.1 10.7l-48.2 79L286.8 81c-6.6-10.6-18.3-17-30.8-17s-24.1 6.4-30.8 17L8.6 426.4C3 435.3 0 445.6 0 456.1 0 487 25 512 55.9 512z" />
    </svg>
  );
}

export function DropdownMenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 15 15"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.5 3.1a.4.4 0 100 .8h7a.4.4 0 000-.8h-7zm0 2a.4.4 0 100 .8h7a.4.4 0 000-.8h-7zm-.4 2.4c0-.22.18-.4.4-.4h7a.4.4 0 010 .8h-7a.4.4 0 01-.4-.4zm.4 1.6a.4.4 0 100 .8h7a.4.4 0 000-.8h-7zm-.4 2.4c0-.22.18-.4.4-.4h7a.4.4 0 010 .8h-7a.4.4 0 01-.4-.4zM2.5 9.25L5 6H0l2.5 3.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

export function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export function StarOutlineIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth={32}
        d="M480 208H308L256 48l-52 160H32l140 96-54 160 138-100 138 100-54-160z"
      />
    </svg>
  );
}

export function StarPartialIcon({
  fillPercentage,
  ...props
}: {
  fillPercentage: number;
  [x: string]: any;
}) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <defs>
        <linearGradient
          id={`partial-${fillPercentage}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop
            offset={`${fillPercentage}%`}
            style={{ stopColor: 'currentColor' }}
          />
          <stop offset={`${fillPercentage}%`} style={{ stopColor: 'gray' }} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#partial-${fillPercentage})`}
        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
      />
    </svg>
  );
}

export function StarHalfIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path d="M5.354 5.119L7.538.792A.516.516 0 018 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0116 6.32a.548.548 0 01-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 01-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 01-.172-.403.58.58 0 01.085-.302.513.513 0 01.37-.245l4.898-.696zM8 12.027a.5.5 0 01.232.056l3.686 1.894-.694-3.957a.565.565 0 01.162-.505l2.907-2.77-4.052-.576a.525.525 0 01-.393-.288L8.001 2.223 8 2.226v9.8z" />
    </svg>
  );
}

export function StarFillIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  );
}

export function EmailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path d="M20 8l-8 5-8-5V6l8 5 8-5m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" />
    </svg>
  );
}

export function PasswordIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 15 15"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path
        fill="currentColor"
        d="M11 11h-1v-1h1v1zM8 11h1v-1H8v1zM13 11h-1v-1h1v1z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 6V3.5a3.5 3.5 0 117 0V6h1.5A1.5 1.5 0 0113 7.5v.55a2.5 2.5 0 010 4.9v.55a1.5 1.5 0 01-1.5 1.5h-10A1.5 1.5 0 010 13.5v-6A1.5 1.5 0 011.5 6H3zm1-2.5a2.5 2.5 0 015 0V6H4V3.5zM8.5 9a1.5 1.5 0 100 3h4a1.5 1.5 0 000-3h-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function ChevronBackIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="currentColor"
      height={iconSize}
      width={iconSize}
      {...props}
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={48}
        d="M328 112L184 256l144 144"
      />
    </svg>
  );
}
