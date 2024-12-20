import { clsx } from "clsx";
import animationData from "@/assets/lottie-json.json"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006f]",
  "bg-[#ffd6a2] text-[#ffd60a] border-[1px] border-[#ffd60a]",
  "bg-[#06d6a0] text-[#06d6a0] border-[1px] border-[#06d6a0]",
  "bg-[#4cc9f0] text-[#4cc9f0] border-[1px] border-[#4cc9f0]",
];


export const getColor = (color)=>{
  if(color>=0 && color<colors.length){
    return colors[color];
  }
  return colors[0];
};


export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData,
}