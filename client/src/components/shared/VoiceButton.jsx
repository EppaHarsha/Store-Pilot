import React, { useEffect, useState } from "react";
import { HiOutlineMicrophone, HiMiniStop } from "react-icons/hi2";

const getSpeechRecognition = () => {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line no-undef
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const VoiceButton = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(Boolean(getSpeechRecognition()));
  }, []);

  const handleClick = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript?.(transcript);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      disabled={!supported}
      onClick={handleClick}
      className={[
        "inline-flex items-center justify-center rounded-full px-3 py-2 text-xs font-medium",
        supported
          ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
          : "bg-slate-800 text-slate-500 cursor-not-allowed"
      ].join(" ")}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {isListening && (
          <span className="absolute inline-flex h-4 w-4 animate-ping rounded-full bg-emerald-300 opacity-75" />
        )}
        {isListening ? (
          <HiMiniStop className="relative h-4 w-4" />
        ) : (
          <HiOutlineMicrophone className="relative h-4 w-4" />
        )}
      </span>
      <span className="ml-2">
        {supported ? (isListening ? "Listening..." : "Voice input") : "No mic"}
      </span>
    </button>
  );
};

export default VoiceButton;

