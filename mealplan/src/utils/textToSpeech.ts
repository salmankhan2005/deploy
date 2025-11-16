// Web-only TTS implementation
export class TTSService {
  static async requestPermissions(): Promise<boolean> {
    return 'speechSynthesis' in window;
  }

  static async speak(text: string): Promise<void> {
    console.log('TTS: Attempting to speak:', text);
    
    try {
      if ('speechSynthesis' in window) {
        // Wait for voices to load
        const voices = speechSynthesis.getVoices();
        console.log('TTS: Available voices:', voices.length);
        
        if (voices.length === 0) {
          // Wait for voices to load
          await new Promise(resolve => {
            speechSynthesis.addEventListener('voiceschanged', resolve, { once: true });
            setTimeout(resolve, 1000); // Fallback timeout
          });
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        // Add event listeners for debugging
        utterance.onstart = () => console.log('TTS: Speech started');
        utterance.onend = () => console.log('TTS: Speech ended');
        utterance.onerror = (e) => console.error('TTS: Speech error:', e);
        
        speechSynthesis.speak(utterance);
        console.log('TTS: Web speech initiated');
      } else {
        console.error('TTS: Speech synthesis not supported');
        throw new Error('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      throw error;
    }
  }

  static async stop(): Promise<void> {
    console.log('TTS: Stopping speech');
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        console.log('TTS: Web speech cancelled');
      }
    } catch (error) {
      console.error('TTS stop error:', error);
    }
  }
}