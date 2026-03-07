export type UseKeyboard = (
  key: string,
  handler: (event: KeyboardEvent) => void,
) => void

/**
 * No-op on React Native. Physical keyboard events are not reliably
 * available across all RN platforms. Use `TextInput.onKeyPress` or
 * a hardware keyboard library for specific use cases.
 */
const useKeyboard: UseKeyboard = () => {
  // No-op — keyboard events require platform-specific handling on RN
}

export default useKeyboard
