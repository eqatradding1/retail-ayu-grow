
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VoiceToCartProps {
  onAddToCart: (productName: string, quantity?: number) => void;
}

const VoiceToCart = ({ onAddToCart }: VoiceToCartProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    // Check if the browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
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
    
    // Parse for quantity
    let quantity = 1;
    const quantityMatch = lowerCommand.match(/\d+/);
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[0], 10);
    }
    
    // Extract product name
    let productName = "";
    
    if (lowerCommand.includes("add")) {
      productName = lowerCommand.split("add")[1].trim();
      // Remove quantity mention if present
      productName = productName.replace(/\d+/g, "").trim();
      productName = productName.replace("pieces", "").replace("piece", "").trim();
    } else {
      // If no specific command detected, use the entire transcript as a product name
      productName = lowerCommand.replace(/\d+/g, "").trim();
      productName = productName.replace("pieces", "").replace("piece", "").trim();
    }
    
    if (productName) {
      onAddToCart(productName, quantity);
      toast.success(`Adding ${quantity} ${productName} to cart`);
    } else {
      toast.error("Could not understand product. Please try again.");
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
          Voice to Cart
        </>
      )}
    </Button>
  );
};

export default VoiceToCart;
