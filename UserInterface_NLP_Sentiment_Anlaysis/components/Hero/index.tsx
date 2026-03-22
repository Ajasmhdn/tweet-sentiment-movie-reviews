"use client";

import { useState } from "react";
import axios from "axios";
import { NextUIProvider, Spinner } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useTheme } from "next-themes";

export default function Home(): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [prediction, setPrediction] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { theme } = useTheme();

  // Map model output → readable labels
  const labelMap: { [key: number]: string } = {
    0: "Negative",
    1: "Neutral",
    2: "Positive",
  };

  const handleClassify = async () => {
    if (!message.trim()) {
      alert("Please enter text to analyze.");
      return;
    }

    setIsLoading(true);
    setPrediction("");

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", {
        text: message, // ✅ FIXED
      });

      const result = response.data.prediction;

      setPrediction(labelMap[result] || "Unknown");
      onOpen();
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("Error connecting to the backend API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setPrediction("");
    onClose();
  };

  return (
    <NextUIProvider>
      <main
        className={`flex min-h-screen flex-col items-center justify-center px-4 ${
          theme === "light" ? "text-black bg-white" : "text-white bg-black"
        }`}
      >
        <div className="max-w-2xl w-full flex flex-col items-center gap-6 text-center">

          {/* Title */}
          <h1 className="text-5xl font-extrabold">
            <span className="text-green-500">Senti</span>
            <span className={theme === "light" ? "text-black" : "text-white"}>
              lytics
            </span>
          </h1>

          {/* Subtitle */}
          <h3 className="text-lg text-gray-400">
            Analyze sentiment instantly using our AI-powered text classification system.
          </h3>

          {/* Text Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your text here to analyze sentiment..."
            className="w-full h-40 p-4 rounded-xl border border-gray-500 bg-transparent text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>

          {/* Button */}
          <button
            onClick={handleClassify}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
            disabled={isLoading}
          >
            {isLoading ? <Spinner color="default" /> : "Analyze Sentiment"}
          </button>
        </div>

        {/* Result Modal */}
        <Modal
          size="md"
          backdrop="blur"
          isOpen={isOpen}
          onClose={handleCloseModal}
          className="bg-gray-800 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-30 border border-gray-200"
        >
          <ModalContent>
            <>
              <ModalHeader className="text-white font-bold text-lg">
                Sentiment Result
              </ModalHeader>

              <ModalBody className="flex flex-col items-center justify-center text-center text-white">
                <p className="text-3xl font-bold">
                  {prediction || "No Result"}
                </p>

                <p className="text-lg text-gray-300">
                  Sentiment detected successfully
                </p>
              </ModalBody>

              <ModalFooter className="flex justify-center">
                <Button color="danger" variant="light" onPress={handleCloseModal}>
                  Close
                </Button>
              </ModalFooter>
            </>
          </ModalContent>
        </Modal>
      </main>
    </NextUIProvider>
  );
}