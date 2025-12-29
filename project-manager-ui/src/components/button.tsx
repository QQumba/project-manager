import { twMerge } from 'tailwind-merge';

export type ButtonProprs = {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
};

export default function Button(props: ButtonProprs) {
  return (
    <button
      className={twMerge(
        'rounded-md w-full bg-gray-600 text-zinc-100 p-2 hover:bg-gray-700 cursor-pointer',
        props.className
      )}
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
    >
      {props.children}
    </button>
  );
}
