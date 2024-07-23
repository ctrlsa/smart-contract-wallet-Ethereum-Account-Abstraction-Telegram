import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const useCloudStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const { toast } = useToast();
  const [error, setError] = useState("");

  const handleStoreInCloudStorage = (textToStore: string) => {
    setIsLoading(true);
    try {
      const storeCallback = (error: string, textWritten: string) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Failed to store text in Telegram Cloud Storage",
            description: error,
          });
          return;
        }
        toast({
          title: "Secret text stored in Telegram Cloud Storage",
          description: textWritten,
        });
      };

      window.Telegram.WebApp.CloudStorage.setItem(
        "secret",
        textToStore,
        storeCallback
      );
    } catch (err: unknown) {
      console.error("Error:", err);
      if (err instanceof Error) {
        console.error("Caught an error:", err.message);
        setError(err.message.toString());
        toast({
          variant: "destructive",
          title: "Failed to store text in Telegram Cloud Storage",
          description: error,
        });
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetrieveFromCloudStorage = () => {
    setIsLoading(true);
    try {
      const retrieveCallback = (err: string, textRetrieved: string) => {
        if (error) {
          toast({
            variant: "destructive",
            title: "Failed to store text from Telegram Cloud Storage",
            description: err,
          });
          return;
        }
        setText(textRetrieved);
        toast({
          title: "Secret text retrieved from Telegram Cloud Storage",
          description: textRetrieved,
        });
      };

      window.Telegram.WebApp.CloudStorage.getItem("secret", retrieveCallback);
    } catch (err: unknown) {
      console.error("Error:", err);
      if (err instanceof Error) {
        console.error("Caught an error:", err.message);
        setError(err.message.toString());
        toast({
          variant: "destructive",
          title: "Failed to store text in Telegram Cloud Storage",
          description: err.message,
        });
      } else {
        console.error("An unexpected error occurred:", err);
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleStoreInCloudStorage,
    handleRetrieveFromCloudStorage,
    text,
    // hasRetrievedText: !!text,
    isLoading,
    error,
  };
};
