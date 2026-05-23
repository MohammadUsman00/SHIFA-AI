export function speakText(text: string, lang: "ur" | "en" | "hi"): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "ur" ? "ur-PK" : lang === "hi" ? "hi-IN" : "en-US";
  utter.rate = 0.92;
  window.speechSynthesis.speak(utter);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined") window.speechSynthesis.cancel();
}
