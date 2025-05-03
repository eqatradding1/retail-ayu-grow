
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VoiceSearchProps {
  onSearchResult: (term: string) => void;
}

const VoiceSearch = ({ onSearchResult }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window?.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US'; // Set language
      
      recognitionInstance.onresult = (event) => {
        // Fix: Access results using the correct event properties
        const result = event.results[0][0].transcript;
        setTranscript(result);
        handleVoiceCommand(result);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Speech recognition failed. Please try again.");
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast.error("Speech recognition is not supported in this browser.");
    }
    
    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      setTranscript("");
      toast.info("Listening for voice commands...");
    }
  };
  
  const handleVoiceCommand = (command: string) => {
    // Convert to lowercase for easier comparison
    const lowerCommand = command.toLowerCase();
    
    // Basic command processing
    if (lowerCommand.includes("add") || lowerCommand.includes("search")) {
      // Extract product name after "add" or "search"
      let productName = "";
      
      if (lowerCommand.includes("add")) {
        productName = lowerCommand.split("add")[1].trim();
      } else if (lowerCommand.includes("search")) {
        productName = lowerCommand.split("search")[1].trim();
      }
      
      if (productName) {
        onSearchResult(productName);
        toast.success(`Searching for "${productName}"`);
      } else {
        toast.error("Could not understand product name. Please try again.");
      }
    } else {
      // If no specific command detected, use the entire transcript as a search term
      onSearchResult(lowerCommand);
      toast.success(`Searching for "${lowerCommand}"`);
    }
  };

  return (
    <Button
      variant={isListening ? "default" : "outline"}
      className={`${isListening ? "bg-red-500 hover:bg-red-600" : ""}`}
      onClick={toggleListening}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          Stop Listening
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Voice Search
        </>
      )}
    </Button>
  );
};

export default VoiceSearch;
