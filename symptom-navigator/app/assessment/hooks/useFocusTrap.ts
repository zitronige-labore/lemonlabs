import { useEffect, RefObject } from "react";

/**
 * Custom React hook to trap keyboard focus within a modal/container.
 * Also handles closing the modal when the "Escape" key is pressed.
 * 
 * @param ref - Ref object pointing to the modal container element
 * @param active - Controls whether the focus trap is currently active
 * @param onClose - Optional callback triggered when the user presses the Escape key
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onClose?: () => void
) {
  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;
    
    // Find all focusable elements inside the modal container
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex="0"]';
    
    // Select elements that are not disabled and do not have tabindex="-1"
    const getFocusableElements = () => {
      const allElements = Array.from(element.querySelectorAll<HTMLElement>(focusableSelector));
      return allElements.filter(
        (el) => 
          !el.hasAttribute("disabled") && 
          el.getAttribute("tabindex") !== "-1"
      );
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift focus inside the modal on open
    firstElement.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && onClose) {
        onClose();
        event.preventDefault();
        return;
      }

      if (event.key !== "Tab") return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab (navigating backward)
        if (document.activeElement === first) {
          last.focus();
          event.preventDefault();
        }
      } else {
        // Tab (navigating forward)
        if (document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, ref, onClose]);
}
