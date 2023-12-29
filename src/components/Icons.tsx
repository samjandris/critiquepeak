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
