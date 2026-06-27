import { useState, useRef, useCallback, useEffect } from 'react';

// SECURITY: In production the OpenAI key must NOT be shipped to the browser.
// We call a server-side proxy (/api/transcribe) that holds the key in
// process.env.OPENAI_API_KEY. The direct OpenAI call is only used in local dev,
// where VITE_OPENAI_API_KEY is available and never deployed.
const WHISPER_URL = import.meta.env.DEV
  ? 'https://api.openai.com/v1/audio/transcriptions'
  : '/api/transcribe';

export interface WhisperTranscriptionHook {
  isListening: boolean;
  isTranscribing: boolean;
  transcript: string;
  interimTranscript: string; // always '' — Whisper is not streaming
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  audioLevel: number;
  audioUrl: string | null;
}

export function useWhisperTranscription(): WhisperTranscriptionHook {
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);

  const isSupported =
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices !== 'undefined' &&
    typeof MediaRecorder !== 'undefined';

  const cleanupMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  const startListening = useCallback(async () => {
    if (!isSupported || isListening) return;

    recordedChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio level visualisation
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setAudioLevel(avg / 255);
        animationFrameRef.current = requestAnimationFrame(tick);
      };
      tick();

      // MediaRecorder captures audio for Whisper
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        cleanupMonitoring();

        const blob = new Blob(recordedChunksRef.current, { type: mimeType });

        // Revoke any previous playback URL
        if (currentAudioUrlRef.current) {
          URL.revokeObjectURL(currentAudioUrlRef.current);
        }
        const url = URL.createObjectURL(blob);
        currentAudioUrlRef.current = url;
        setAudioUrl(url);

        if (blob.size < 1000) return; // too short — skip Whisper call

        setIsTranscribing(true);
        try {
          const form = new FormData();
          // Whisper requires a filename with extension to detect format
          form.append('file', blob, mimeType === 'audio/webm' ? 'audio.webm' : 'audio.ogg');
          form.append('model', 'whisper-1');
          form.append('language', 'en');

          // In dev, call OpenAI directly with the local key; in prod, go through
          // the server-side proxy so the key never reaches the browser bundle.
          const headers: Record<string, string> = {};
          if (import.meta.env.DEV) {
            headers.Authorization = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`;
          }

          const res = await fetch(WHISPER_URL, {
            method: 'POST',
            headers,
            body: form,
          });

          if (!res.ok) throw new Error(`Whisper ${res.status}: ${await res.text()}`);
          const json = await res.json();
          setTranscript(json.text?.trim() ?? '');
        } catch (err) {
          console.error('Whisper transcription failed:', err);
          setTranscript('');
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      cleanupMonitoring();
    }
  }, [isSupported, isListening, cleanupMonitoring]);

  const stopListening = useCallback(() => {
    setIsListening(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop(); // triggers recorder.onstop → Whisper call
      mediaRecorderRef.current = null;
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
    setAudioUrl(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      cleanupMonitoring();
      if (currentAudioUrlRef.current) {
        URL.revokeObjectURL(currentAudioUrlRef.current);
      }
    };
  }, [cleanupMonitoring]);

  return {
    isListening,
    isTranscribing,
    transcript,
    interimTranscript: '',
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    audioLevel,
    audioUrl,
  };
}
