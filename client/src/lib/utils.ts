import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Creates a typewriter effect for displaying text.
 * @param {string} text - The text to display with the typewriter effect.
 * @param {HTMLElement} element - The HTML element where the text will be displayed.
 * @param {number} speed - The speed of the typewriter effect in milliseconds (default: 50ms).
 * @param {function} onComplete - A callback function to execute after the typewriter effect finishes.
 */
function typewriterEffect({ text, element, speed = 50 }: any) {
  let i = 0;
  element.textContent = ""; // Clear the element's content

  const type = () => {
    if (i < text.length) {
      // Add the next character
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed); // Continue typing after a delay
    }
  };

  // Start the typewriter effect
  type();
}
export const BIG_NUMBER = 999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999;
